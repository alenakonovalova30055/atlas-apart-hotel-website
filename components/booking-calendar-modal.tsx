"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface DayPrice {
  date: string;
  available: boolean;
  price: number | null;
}

interface MonthData {
  year: number;
  month: number;
  days: DayPrice[];
}

interface BookingCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  apartmentId: string;
  onSelectDates: (checkIn: Date, checkOut: Date) => void;
}

const monthNames = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU").format(price) + " P";
}

export function BookingCalendarModal({
  isOpen,
  onClose,
  apartmentId,
  onSelectDates,
}: BookingCalendarModalProps) {
  const today = new Date();
  const [baseMonth, setBaseMonth] = useState(today.getMonth());
  const [baseYear, setBaseYear] = useState(today.getFullYear());
  const [isLoading, setIsLoading] = useState(false);
  const [month1Data, setMonth1Data] = useState<MonthData | null>(null);
  const [month2Data, setMonth2Data] = useState<MonthData | null>(null);
  const [selectedCheckIn, setSelectedCheckIn] = useState<string | null>(null);
  const [selectedCheckOut, setSelectedCheckOut] = useState<string | null>(null);
  const [selectionMode, setSelectionMode] = useState<"checkIn" | "checkOut">("checkIn");

  // Calculate second month
  const month2 = baseMonth === 11 ? 0 : baseMonth + 1;
  const year2 = baseMonth === 11 ? baseYear + 1 : baseYear;

  // Load prices for current 2 months
  const loadPrices = useCallback(async () => {
    setIsLoading(true);

    try {
      const month1Str = `${baseYear}-${String(baseMonth + 1).padStart(2, "0")}`;
      const month2Str = `${year2}-${String(month2 + 1).padStart(2, "0")}`;

      const response = await fetch(
        `/api/calendar-prices?apartmentId=${apartmentId}&month1=${month1Str}&month2=${month2Str}`
      );
      const data = await response.json();

      if (data.success) {
        setMonth1Data(data.month1);
        setMonth2Data(data.month2);
      }
    } catch (error) {
      console.error("Failed to load calendar prices:", error);
    } finally {
      setIsLoading(false);
    }
  }, [apartmentId, baseMonth, baseYear, month2, year2]);

  useEffect(() => {
    if (isOpen) {
      loadPrices();
    }
  }, [isOpen, loadPrices]);

  // Navigation
  const canGoPrev = !(baseYear === today.getFullYear() && baseMonth === today.getMonth());
  const maxDate = new Date(today.getFullYear(), today.getMonth() + 12, 1);
  const canGoNext = new Date(baseYear, baseMonth + 2, 1) < maxDate;

  const goToPrevMonth = () => {
    if (!canGoPrev || isLoading) return;
    setMonth1Data(null);
    setMonth2Data(null);
    if (baseMonth === 0) {
      setBaseMonth(11);
      setBaseYear(baseYear - 1);
    } else {
      setBaseMonth(baseMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (!canGoNext || isLoading) return;
    setMonth1Data(null);
    setMonth2Data(null);
    if (baseMonth === 11) {
      setBaseMonth(0);
      setBaseYear(baseYear + 1);
    } else {
      setBaseMonth(baseMonth + 1);
    }
  };

  // Handle day click
  const handleDayClick = (dateStr: string, available: boolean) => {
    if (!available || isLoading) return;

    if (selectionMode === "checkIn") {
      setSelectedCheckIn(dateStr);
      setSelectedCheckOut(null);
      setSelectionMode("checkOut");
    } else {
      if (selectedCheckIn && dateStr > selectedCheckIn) {
        setSelectedCheckOut(dateStr);
        onSelectDates(new Date(selectedCheckIn), new Date(dateStr));
        onClose();
      } else {
        setSelectedCheckIn(dateStr);
        setSelectedCheckOut(null);
      }
    }
  };

  // Check if date is in selected range
  const isInRange = (dateStr: string): boolean => {
    if (!selectedCheckIn || !selectedCheckOut) return false;
    return dateStr > selectedCheckIn && dateStr < selectedCheckOut;
  };

  // Render skeleton day cell
  const renderSkeletonDay = (key: string) => (
    <div 
      key={key} 
      className="aspect-[1/1.2] flex flex-col items-center justify-center rounded-lg"
    >
      <div className="w-6 h-5 bg-gray-200 rounded animate-pulse mb-1" />
      <div className="w-10 h-3 bg-gray-100 rounded animate-pulse" />
    </div>
  );

  // Render single month
  const renderMonth = (monthData: MonthData | null, year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    return (
      <div className="flex-1">
        <h3 className="text-center text-lg font-medium text-[#174051] mb-4">
          {monthNames[month]} {year}
        </h3>

        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs text-[#4A7A8C] font-medium py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for first day offset */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${month}-${i}`} className="aspect-[1/1.2]" />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;

            // Show skeleton while loading
            if (isLoading || !monthData) {
              return renderSkeletonDay(`skeleton-${month}-${dayNum}`);
            }

            const dayData = monthData.days[i];
            if (!dayData) {
              return renderSkeletonDay(`no-data-${month}-${dayNum}`);
            }

            const isSelected = dateStr === selectedCheckIn || dateStr === selectedCheckOut;
            const isCheckIn = dateStr === selectedCheckIn;
            const isCheckOut = dateStr === selectedCheckOut;
            const inRange = isInRange(dateStr);

            return (
              <button
                key={dateStr}
                onClick={() => handleDayClick(dateStr, dayData.available)}
                disabled={!dayData.available}
                className={`
                  aspect-[1/1.2] flex flex-col items-center justify-center rounded-lg text-sm transition-all
                  ${isSelected ? "bg-[#2d80a1] text-white" : ""}
                  ${inRange ? "bg-[#2d80a1]/10" : ""}
                  ${isCheckIn ? "rounded-r-none" : ""}
                  ${isCheckOut ? "rounded-l-none" : ""}
                  ${dayData.available && !isSelected ? "hover:bg-[#2d80a1]/20 cursor-pointer" : ""}
                  ${!dayData.available ? "text-gray-300 cursor-not-allowed" : "text-[#174051]"}
                `}
              >
                <span className={`font-medium ${isSelected ? "text-white" : ""}`}>
                  {dayNum}
                </span>
                {dayData.price && dayData.available && (
                  <span className={`text-[9px] mt-0.5 ${isSelected ? "text-white/80" : "text-[#4A7A8C]"}`}>
                    {formatPrice(dayData.price)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <button
            onClick={goToPrevMonth}
            disabled={!canGoPrev || isLoading}
            className={`p-2 rounded-lg transition-colors ${canGoPrev && !isLoading ? "hover:bg-gray-100" : "opacity-30 cursor-not-allowed"}`}
          >
            <ChevronLeft className="w-5 h-5 text-[#174051]" />
          </button>

          <div className="flex-1 text-center">
            <span className="text-sm font-medium text-[#174051]">
              {selectionMode === "checkIn" ? "Выберите дату заезда" : "Выберите дату выезда"}
            </span>
            {isLoading && (
              <span className="ml-2 text-xs text-[#2d80a1] animate-pulse">Загрузка дат...</span>
            )}
          </div>

          <button
            onClick={goToNextMonth}
            disabled={!canGoNext || isLoading}
            className={`p-2 rounded-lg transition-colors ${canGoNext && !isLoading ? "hover:bg-gray-100" : "opacity-30 cursor-not-allowed"}`}
          >
            <ChevronRight className="w-5 h-5 text-[#174051]" />
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors ml-2"
          >
            <X className="w-5 h-5 text-[#174051]" />
          </button>
        </div>

        {/* Calendar content */}
        <div className="p-6">
          {/* Two months side by side */}
          <div className="flex gap-8">
            {renderMonth(month1Data, baseYear, baseMonth)}
            <div className="w-px bg-gray-200" />
            {renderMonth(month2Data, year2, month2)}
          </div>
        </div>

        {/* Footer with legend */}
        <div className="px-6 pb-4 flex items-center justify-between text-xs text-[#4A7A8C]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-[#2d80a1]" />
              <span>Выбрано</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-gray-100 text-gray-300 flex items-center justify-center text-[10px]">-</div>
              <span>Недоступно</span>
            </div>
          </div>
          {selectedCheckIn && (
            <div className="text-[#174051]">
              Заезд: <span className="font-medium">{new Date(selectedCheckIn).toLocaleDateString("ru-RU")}</span>
              {selectedCheckOut && (
                <> — Выезд: <span className="font-medium">{new Date(selectedCheckOut).toLocaleDateString("ru-RU")}</span></>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
