import { PricingBreakdown } from '@/types/events';
import { IndianRupee, Users, Clock, Image, Video, Gift } from 'lucide-react';

interface PriceSummaryProps {
  breakdown: PricingBreakdown;
}

export function PriceSummary({ breakdown }: PriceSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg border-2 border-blue-500 shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-lg">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <IndianRupee className="w-6 h-6" />
          Price Summary
        </h2>
        <p className="text-blue-100 text-sm mt-1">Complete breakdown of your booking</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Event Functions Section */}
        {breakdown.functions.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Event Functions
            </h3>
            <div className="space-y-3">
              {breakdown.functions.map((func, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{func.functionName}</h4>
                      <div className="text-xs text-gray-600 mt-1 space-y-1">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {func.details.duration % 1 === 0 ? `${func.details.duration}h` : `${func.details.duration}h`} duration
                            {func.details.extraHours > 0 && (
                              <span className="text-orange-600">
                                {' '}(+{func.details.extraHours % 1 === 0 ? `${func.details.extraHours}h` : `${func.details.extraHours}h`} extra)
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>
                            {func.details.photographers}P + {func.details.cinematographers}C
                            {func.details.extraCrewCount > 0 && (
                              <span className="text-orange-600">
                                {' '}(+{func.details.extraCrewCount} extra crew)
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{formatCurrency(func.totalFunctionCost)}</div>
                    </div>
                  </div>
                  
                  {/* Breakdown of costs */}
                  <div className="mt-3 pt-3 border-t border-gray-300 space-y-1 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Base Price</span>
                      <span>{formatCurrency(func.basePrice)}</span>
                    </div>
                    {func.extraHoursCost > 0 && (
                      <div className="flex justify-between text-orange-600">
                        <span>Extra Hours ({func.details.extraHours}h)</span>
                        <span>+{formatCurrency(func.extraHoursCost)}</span>
                      </div>
                    )}
                    {func.extraCrewCost > 0 && (
                      <div className="flex justify-between text-orange-600">
                        <span>Extra Crew ({func.details.extraCrewCount} members)</span>
                        <span>+{formatCurrency(func.extraCrewCost)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-300 flex justify-between font-semibold text-gray-800">
              <span>Functions Subtotal</span>
              <span>{formatCurrency(breakdown.functions.reduce((sum, f) => sum + f.totalFunctionCost, 0))}</span>
            </div>
          </div>
        )}

        {/* Album Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Image className="w-5 h-5 text-green-600" />
            Photo Album
          </h3>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-gray-900">
                  {breakdown.album.details.albumType === 'two-photobooks' ? 'Double Album' : 'Single Album'}
                </h4>
                <div className="text-xs text-gray-600 mt-1">
                  {breakdown.album.details.pages} pages
                  {breakdown.album.details.extraPages > 0 && (
                    <span className="text-green-700">
                      {' '}(+{breakdown.album.details.extraPages} extra pages)
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">{formatCurrency(breakdown.album.totalAlbumCost)}</div>
              </div>
            </div>
            
            {/* Breakdown of costs */}
            <div className="mt-3 pt-3 border-t border-green-300 space-y-1 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Base Price ({breakdown.album.details.basePages} pages)</span>
                <span>{formatCurrency(breakdown.album.basePrice)}</span>
              </div>
              {breakdown.album.extraPagesCost > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Extra Pages</span>
                  <span>+{formatCurrency(breakdown.album.extraPagesCost)}</span>
                </div>
              )}
              {breakdown.album.details.multiplier > 1 && (
                <div className="flex justify-between text-green-700">
                  <span>Double Album (×{breakdown.album.details.multiplier})</span>
                  <span>Applied</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Video Add-ons Section */}
        {breakdown.videoAddons.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Video className="w-5 h-5 text-purple-600" />
              Video Add-ons
            </h3>
            <div className="space-y-2">
              {breakdown.videoAddons.map((addon, index) => (
                <div key={index} className="bg-purple-50 rounded-lg p-3 border border-purple-200 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">{addon.label}</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(addon.price)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-300 flex justify-between font-semibold text-gray-800">
              <span>Video Add-ons Subtotal</span>
              <span>{formatCurrency(breakdown.videoAddons.reduce((sum, v) => sum + v.price, 0))}</span>
            </div>
          </div>
        )}

        {/* Totals Section */}
        <div className="border-t-2 border-gray-300 pt-4 space-y-3">
          <div className="flex justify-between text-lg font-semibold text-gray-800">
            <span>Subtotal</span>
            <span>{formatCurrency(breakdown.subtotal)}</span>
          </div>
          
          {breakdown.tax > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>Tax</span>
              <span>{formatCurrency(breakdown.tax)}</span>
            </div>
          )}
          
          <div className="flex justify-between text-2xl font-bold text-blue-600 pt-3 border-t border-gray-300">
            <span>Total Amount</span>
            <span>{formatCurrency(breakdown.total)}</span>
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-2 border-blue-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Payment Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Advance Payment (30%)</span>
              <span className="text-lg font-bold text-green-600">{formatCurrency(breakdown.advance)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Balance Due</span>
              <span className="text-lg font-bold text-orange-600">{formatCurrency(breakdown.balance)}</span>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-xs text-yellow-800">
            <strong>Note:</strong> This is an estimated quote. Final pricing may vary based on actual requirements and any additional services requested during the event.
          </p>
        </div>
      </div>
    </div>
  );
}
