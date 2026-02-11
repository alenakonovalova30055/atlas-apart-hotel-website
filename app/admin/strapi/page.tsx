'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, Check, X, Loader2, Upload, Database, ExternalLink } from 'lucide-react'

interface CheckResult {
  connected: boolean
  url?: string
  apartmentsCount?: number
  hasApartmentsContentType?: boolean
  error?: string
  message?: string
}

interface ImportResult {
  success: boolean
  imported: number
  failed: number
  results: Array<{ id: string; success: boolean; error?: string }>
}

export default function StrapiAdminPage() {
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null)
  const [isChecking, setIsChecking] = useState(true)
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)

  useEffect(() => {
    checkConnection()
  }, [])

  async function checkConnection() {
    setIsChecking(true)
    try {
      const response = await fetch('/api/strapi/check')
      const data = await response.json()
      setCheckResult(data)
    } catch (error) {
      setCheckResult({ connected: false, error: 'Failed to check connection' })
    }
    setIsChecking(false)
  }

  async function importApartments() {
    setIsImporting(true)
    setImportResult(null)
    try {
      const response = await fetch('/api/strapi/import-apartments', {
        method: 'POST'
      })
      const data = await response.json()
      setImportResult(data)
      // Refresh connection check
      await checkConnection()
    } catch (error) {
      setImportResult({ success: false, imported: 0, failed: 0, results: [] })
    }
    setIsImporting(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-[#2d80a1] hover:underline mb-6">
          <ChevronLeft className="w-4 h-4" />
          Назад на сайт
        </Link>

        <h1 className="text-3xl font-bold text-[#174051] mb-2">Интеграция со Strapi</h1>
        <p className="text-gray-600 mb-8">Управление контентом через Strapi CMS</p>

        {/* Connection Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#174051] flex items-center gap-2">
              <Database className="w-5 h-5" />
              Статус подключения
            </h2>
            <button
              onClick={checkConnection}
              disabled={isChecking}
              className="text-sm text-[#2d80a1] hover:underline disabled:opacity-50"
            >
              Обновить
            </button>
          </div>

          {isChecking ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              Проверка подключения...
            </div>
          ) : checkResult ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {checkResult.connected ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <X className="w-5 h-5 text-red-600" />
                )}
                <span className={checkResult.connected ? 'text-green-700' : 'text-red-700'}>
                  {checkResult.connected ? 'Подключено' : 'Не подключено'}
                </span>
              </div>

              {checkResult.url && (
                <div className="text-sm text-gray-600">
                  URL: <a href={checkResult.url} target="_blank" rel="noopener noreferrer" className="text-[#2d80a1] hover:underline">
                    {checkResult.url} <ExternalLink className="w-3 h-3 inline" />
                  </a>
                </div>
              )}

              {checkResult.connected && (
                <div className="text-sm">
                  <span className={checkResult.hasApartmentsContentType ? 'text-green-600' : 'text-amber-600'}>
                    {checkResult.hasApartmentsContentType 
                      ? `Content Type "apartments" найден (${checkResult.apartmentsCount} записей)`
                      : 'Content Type "apartments" не найден'
                    }
                  </span>
                </div>
              )}

              {checkResult.error && (
                <div className="text-sm text-red-600">{checkResult.error}</div>
              )}

              {checkResult.message && (
                <div className="text-sm text-amber-600">{checkResult.message}</div>
              )}
            </div>
          ) : null}
        </div>

        {/* Setup Instructions */}
        {checkResult?.connected && !checkResult.hasApartmentsContentType && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-amber-800 mb-4">Создание Content Type</h2>
            <p className="text-amber-700 mb-4">
              Для работы интеграции необходимо создать Content Type "Apartment" в Strapi:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-amber-800">
              <li>Откройте <a href={`${checkResult.url}/admin`} target="_blank" rel="noopener noreferrer" className="text-[#2d80a1] underline">Strapi Admin</a></li>
              <li>Перейдите в Content-Type Builder</li>
              <li>Создайте новый Collection Type с именем "Apartment"</li>
              <li>Добавьте следующие поля:</li>
            </ol>
            
            <div className="mt-4 bg-white rounded-lg p-4 text-sm font-mono overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-2">Поле</th>
                    <th className="pb-2">Тип</th>
                    <th className="pb-2">Обязательно</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr><td className="py-1">name</td><td>Text (Short)</td><td>Да</td></tr>
                  <tr><td className="py-1">slug</td><td>UID (from name)</td><td>Да</td></tr>
                  <tr><td className="py-1">description</td><td>Text (Long)</td><td>Да</td></tr>
                  <tr><td className="py-1">shortDescription</td><td>Text (Short)</td><td>Нет</td></tr>
                  <tr><td className="py-1">size</td><td>Text (Short)</td><td>Да</td></tr>
                  <tr><td className="py-1">maxGuests</td><td>Number (integer)</td><td>Да</td></tr>
                  <tr><td className="py-1">rooms</td><td>Text (Short)</td><td>Да</td></tr>
                  <tr><td className="py-1">basePrice</td><td>Number (integer)</td><td>Да</td></tr>
                  <tr><td className="py-1">shelterCategoryId</td><td>Number (integer)</td><td>Да</td></tr>
                  <tr><td className="py-1">amenities</td><td>Text (Long)</td><td>Нет</td></tr>
                  <tr><td className="py-1">isActive</td><td>Boolean (default: true)</td><td>Да</td></tr>
                  <tr><td className="py-1">order</td><td>Number (integer)</td><td>Нет</td></tr>
                  <tr><td className="py-1">images</td><td>Media (Multiple)</td><td>Нет</td></tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 p-3 bg-amber-100 rounded text-sm text-amber-800">
              <strong>Важно:</strong> После создания Content Type перейдите в Settings &rarr; Roles &rarr; Public 
              и разрешите find и findOne для Apartments
            </div>
          </div>
        )}

        {/* Import Section */}
        {checkResult?.connected && checkResult.hasApartmentsContentType && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-[#174051] mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Импорт апартаментов
            </h2>
            
            <p className="text-gray-600 mb-4">
              Импортировать текущие апартаменты (Azure, Морской Делюкс, Белый Бархат) в Strapi.
              Существующие записи будут обновлены.
            </p>

            <button
              onClick={importApartments}
              disabled={isImporting}
              className="bg-[#2d80a1] hover:bg-[#226079] disabled:bg-gray-400 text-white font-medium px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Импорт...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Импортировать апартаменты
                </>
              )}
            </button>

            {importResult && (
              <div className={`mt-4 p-4 rounded-lg ${importResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className={`font-medium ${importResult.success ? 'text-green-800' : 'text-red-800'}`}>
                  {importResult.success ? 'Импорт завершен успешно' : 'Импорт завершен с ошибками'}
                </div>
                <div className="text-sm mt-2">
                  Импортировано: {importResult.imported}, Ошибок: {importResult.failed}
                </div>
                {importResult.results.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {importResult.results.map(r => (
                      <div key={r.id} className={`text-sm flex items-center gap-2 ${r.success ? 'text-green-700' : 'text-red-700'}`}>
                        {r.success ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        {r.id}
                        {r.error && <span className="text-red-500">: {r.error}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Current Apartments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#174051] mb-4">Апартаменты для импорта</h2>
          <div className="space-y-3">
            {[
              { id: 'azure', name: 'Azure', shelterId: 56018 },
              { id: 'sea-deluxe', name: 'Морской Делюкс', shelterId: 56019 },
              { id: 'sunrise-terrace', name: 'Белый Бархат', shelterId: 56020 }
            ].map(apt => (
              <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-[#174051]">{apt.name}</div>
                  <div className="text-sm text-gray-500">slug: {apt.id}</div>
                </div>
                <div className="text-sm text-gray-500">
                  Shelter ID: {apt.shelterId}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
