"use i18n";
import { useState, useMemo } from "react";
import { ArrowRightLeft, RefreshCw } from "lucide-react";

interface CurrencyConverterProps {
  defaultToCurrency?: string;
}

// Exchange rates (simulated - in production, use a real API)
const exchangeRates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50,
  CNY: 7.24,
  AED: 3.67,
  INR: 83.12,
  THB: 35.50,
  IDR: 15650,
  MYR: 4.72,
  SGD: 1.34,
  AUD: 1.53,
  CAD: 1.36,
  CHF: 0.88,
  KRW: 1320,
  MVR: 15.42,
  ISK: 137.50,
};

const currencyInfo: Record<string, { name: string; symbol: string; flag: string }> = {
  USD: { name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  EUR: { name: "Euro", symbol: "€", flag: "🇪🇺" },
  GBP: { name: "British Pound", symbol: "£", flag: "🇬🇧" },
  JPY: { name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  CNY: { name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  AED: { name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
  INR: { name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  THB: { name: "Thai Baht", symbol: "฿", flag: "🇹🇭" },
  IDR: { name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩" },
  MYR: { name: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾" },
  SGD: { name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
  AUD: { name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  CAD: { name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  CHF: { name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭" },
  KRW: { name: "South Korean Won", symbol: "₩", flag: "🇰🇷" },
  MVR: { name: "Maldivian Rufiyaa", symbol: "Rf", flag: "🇲🇻" },
  ISK: { name: "Icelandic Króna", symbol: "kr", flag: "🇮🇸" },
};

export default function CurrencyConverter({ defaultToCurrency = "EUR" }: CurrencyConverterProps) {
  const [amount, setAmount] = useState<string>("100");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState(defaultToCurrency);

  const convertedAmount = useMemo(() => {
    const numAmount = parseFloat(amount) || 0;
    const fromRate = exchangeRates[fromCurrency] || 1;
    const toRate = exchangeRates[toCurrency] || 1;
    return (numAmount / fromRate) * toRate;
  }, [amount, fromCurrency, toCurrency]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return num.toLocaleString("en-US", { maximumFractionDigits: 2 });
    }
    return num.toFixed(2);
  };

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <ArrowRightLeft className="w-5 h-5 text-emerald-400" />
        <>Currency Converter</>
      </h3>

      <div className="space-y-4">
        {/* From Currency */}
        <div>
          <label className="block text-sm text-gray-400 mb-2"><>From</></label>
          <div className="flex gap-2">
            <div className="flex-1 min-w-0">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white/5 backdrop-blur border border-white/10 rounded-xl px-4 py-3 text-xl font-semibold text-white focus:outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 transition-all"
                placeholder="0"
                min="0"
              />
            </div>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-28 flex-shrink-0 bg-white/5 backdrop-blur border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-sky-500/50 transition-all"
            >
              {Object.keys(currencyInfo).map((code) => (
                <option key={code} value={code} className="bg-gray-800">
                  {currencyInfo[code].flag} {code}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {currencyInfo[fromCurrency]?.name}
          </p>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={swapCurrencies}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:rotate-180 duration-300"
          >
            <RefreshCw className="w-5 h-5 text-sky-400" />
          </button>
        </div>

        {/* To Currency */}
        <div>
          <label className="block text-sm text-gray-400 mb-2"><>To</></label>
          <div className="flex gap-2">
            <div className="flex-1 min-w-0 bg-white/5 backdrop-blur border border-white/10 rounded-xl px-4 py-3 flex items-center">
              <span className="text-emerald-400 text-xl">
                {currencyInfo[toCurrency]?.symbol}
              </span>
              <span className="ml-2 text-xl font-semibold text-white">{formatNumber(convertedAmount)}</span>
            </div>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-28 flex-shrink-0 bg-white/5 backdrop-blur border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-sky-500/50 transition-all"
            >
              {Object.keys(currencyInfo).map((code) => (
                <option key={code} value={code} className="bg-gray-800">
                  {currencyInfo[code].flag} {code}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {currencyInfo[toCurrency]?.name}
          </p>
        </div>

        {/* Exchange Rate */}
        <div className="mt-4 p-3 rounded-xl bg-white/5 text-center">
          <p className="text-sm text-gray-400">
            <>Exchange Rate</>
          </p>
          <p className="text-white font-medium">
            1 {fromCurrency} = {formatNumber(exchangeRates[toCurrency] / exchangeRates[fromCurrency])} {toCurrency}
          </p>
        </div>

        {/* Quick amounts */}
        <div className="flex gap-2 flex-wrap">
          {[50, 100, 500, 1000].map((quickAmount) => (
            <button
              key={quickAmount}
              onClick={() => setAmount(quickAmount.toString())}
              className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-sm transition-colors"
            >
              {currencyInfo[fromCurrency]?.symbol}{quickAmount}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
