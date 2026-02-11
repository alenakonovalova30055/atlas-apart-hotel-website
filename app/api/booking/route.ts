import { NextResponse } from "next/server";
import { createOrder, checkAvailability } from "@/lib/shelter";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      apartmentId,
      checkIn,
      checkOut,
      adults,
      guestName,
      guestPhone,
      guestEmail,
      comment,
      // Данные из проверки доступности (getVariants)
      signature,
      roomCategoryID,
      tariffID,
      price,
      // Данные о скидке и спецпредложении
      priceWithoutDiscount,
      discountPercent,
      specialOffer, // название акции если выбрана
    } = body;

    // Валидация
    if (!apartmentId || !checkIn || !checkOut || !adults || !guestName || !guestPhone || !guestEmail) {
      return NextResponse.json(
        { success: false, error: "Не все обязательные поля заполнены" },
        { status: 400 }
      );
    }

    // Если signature не передан - получаем через checkAvailability
    let bookingSignature = signature;
    let bookingRoomCategoryID = roomCategoryID;
    let bookingTariffID = tariffID;
    let bookingPrice = price;
    
    if (!bookingSignature) {
      const availabilityResult = await checkAvailability({
        apartmentId,
        checkIn,
        checkOut,
        adults: parseInt(adults, 10),
      });

      if (!availabilityResult.available || !availabilityResult.variant) {
        return NextResponse.json({
          success: false,
          error: availabilityResult.error || "Номер недоступен на выбранные даты",
        });
      }

      bookingSignature = availabilityResult.variant.signature;
      bookingRoomCategoryID = availabilityResult.variant.roomCategoryID;
      bookingTariffID = availabilityResult.variant.tariffID;
      bookingPrice = availabilityResult.variant.price;
    }

    // Разделяем ФИО на фамилию и имя
    const nameParts = guestName.trim().split(" ");
    const lastName = nameParts[0] || "";
    const firstName = nameParts.slice(1).join(" ") || lastName;
    const middleName = nameParts.length > 2 ? nameParts.slice(2).join(" ") : "";

    // Формируем комментарий с информацией о спецпредложении
    let fullComment = comment || "";
    if (specialOffer) {
      const offerInfo = `Спецпредложение: ${specialOffer}`;
      if (discountPercent) {
        fullComment = `${offerInfo} (скидка ${discountPercent}%). ${fullComment}`.trim();
      } else {
        fullComment = `${offerInfo}. ${fullComment}`.trim();
      }
    }

    console.log("[Booking API] Creating reservation via putOrder:", {
      signature: bookingSignature?.substring(0, 20) + "...",
      roomCategoryID: bookingRoomCategoryID,
      tariffID: bookingTariffID,
      price: bookingPrice,
      priceWithoutDiscount,
      discountPercent,
      specialOffer,
      comment: fullComment,
    });

    // Создаем бронирование через Online API putOrder
    const result = await createOrder({
      signature: bookingSignature,
      dateFrom: checkIn,
      dateTo: checkOut,
      roomCategoryID: bookingRoomCategoryID,
      tariffID: bookingTariffID,
      price: bookingPrice,
      priceWithoutDiscount: priceWithoutDiscount || bookingPrice,
      discountPercent: discountPercent || 0,
      guestsCount: parseInt(adults, 10),
      guest: {
        firstName,
        lastName,
        middleName,
        phone: guestPhone,
        email: guestEmail,
      },
      comment: fullComment,
      paymentMethodID: 2, // Оплата в отеле
    });

    if (!result.success) {
      console.error("[Booking API] Shelter error:", result.error);
      return NextResponse.json({
        success: false,
        error: result.error || "Ошибка создания бронирования",
      });
    }

    // Ответ putOrder содержит массив data с информацией о бронировании
    const orderData = result.data as unknown;
    let bookingCode = null;
    
    if (orderData && typeof orderData === 'object' && 'data' in orderData) {
      const dataArray = (orderData as { data: unknown[][] }).data;
      if (Array.isArray(dataArray) && dataArray[0] && dataArray[0][0]) {
        const firstItem = dataArray[0][0] as { bookingCode?: number };
        bookingCode = firstItem.bookingCode;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Бронирование успешно создано",
      data: {
        bookingCode,
      },
    });
  } catch (error) {
    console.error("[Booking API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Ошибка при создании бронирования" },
      { status: 500 }
    );
  }
}
