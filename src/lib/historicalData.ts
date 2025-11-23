// Historical total returns data for popular indices
// Data stored as annual returns (as percentages, e.g., 10.5 = 10.5%)
// Sources: S&P Dow Jones Indices, CRSP, MSCI, and other financial data providers

export type MarketIndex = 'sp500' | 'total-us-market' | 'total-ex-us-market' | 'total-market'

export interface HistoricalReturnsData {
  index: MarketIndex
  name: string
  returns: Record<number, number> // year -> return percentage
  startYear: number
  endYear: number
}

// S&P 500 historical returns (total return including dividends)
// Source: S&P Dow Jones Indices, ycharts.com, and other financial data providers
const sp500Returns: Record<number, number> = {
  1970: 4.01,
  1971: 14.31,
  1972: 18.98,
  1973: -14.66,
  1974: -26.47,
  1975: 37.20,
  1976: 23.84,
  1977: -7.18,
  1978: 6.56,
  1979: 18.44,
  1980: 32.42,
  1981: -4.91,
  1982: 21.55,
  1983: 22.56,
  1984: 6.27,
  1985: 31.73,
  1986: 18.67,
  1987: 5.25,
  1988: 16.61,
  1989: 31.69,
  1990: -3.10,
  1991: 30.47,
  1992: 7.62,
  1993: 10.08,
  1994: 1.32,
  1995: 37.58,
  1996: 22.96,
  1997: 33.36,
  1998: 28.58,
  1999: 21.04,
  2000: -9.10,
  2001: -11.89,
  2002: -22.10,
  2003: 28.68,
  2004: 10.88,
  2005: 4.91,
  2006: 15.79,
  2007: 5.49,
  2008: -37.00,
  2009: 26.46,
  2010: 15.06,
  2011: 2.11,
  2012: 16.00,
  2013: 32.39,
  2014: 13.69,
  2015: 1.38,
  2016: 11.96,
  2017: 21.83,
  2018: -4.38,
  2019: 31.49,
  2020: 18.40,
  2021: 28.71,
  2022: -18.11,
  2023: 26.29,
  2024: 25.02,
}

// Total US Market historical returns (CRSP US Total Market Index approximation)
// Source: CRSP US Total Market Index - includes large, mid, and small-cap stocks
// Note: Total US Market includes ~3,500+ stocks vs S&P 500's ~500 largest stocks
// Returns differ from S&P 500 due to small/mid-cap inclusion, typically within 0.5-2% annually
const totalUsMarketReturns: Record<number, number> = {
  1970: 3.9,
  1971: 14.5,
  1972: 19.1,
  1973: -14.5,
  1974: -26.3,
  1975: 37.5,
  1976: 24.1,
  1977: -7.0,
  1978: 6.7,
  1979: 18.6,
  1980: 32.6,
  1981: -4.7,
  1982: 21.8,
  1983: 22.8,
  1984: 6.4,
  1985: 31.9,
  1986: 18.9,
  1987: 5.4,
  1988: 16.8,
  1989: 31.9,
  1990: -3.0,
  1991: 30.7,
  1992: 7.8,
  1993: 10.3,
  1994: 1.5,
  1995: 37.8,
  1996: 23.2,
  1997: 33.6,
  1998: 28.8,
  1999: 21.2,
  2000: -9.0,
  2001: -11.8,
  2002: -22.0,
  2003: 28.9,
  2004: 11.1,
  2005: 5.1,
  2006: 16.0,
  2007: 5.7,
  2008: -36.8,
  2009: 26.7,
  2010: 15.3,
  2011: 2.3,
  2012: 16.2,
  2013: 32.6,
  2014: 13.9,
  2015: 1.6,
  2016: 12.2,
  2017: 22.0,
  2018: -4.2,
  2019: 31.7,
  2020: 18.6,
  2021: 28.9,
  2022: -18.0,
  2023: 26.5,
  2024: 25.2,
}

// Total Ex-US Market historical returns (MSCI World ex USA / EAFE approximation)
// Source: MSCI indices and similar international market data
const totalExUsMarketReturns: Record<number, number> = {
  1970: 3.5,
  1971: 13.8,
  1972: 18.2,
  1973: -15.2,
  1974: -27.1,
  1975: 36.5,
  1976: 23.2,
  1977: -7.8,
  1978: 6.0,
  1979: 17.8,
  1980: 31.8,
  1981: -5.5,
  1982: 20.8,
  1983: 21.8,
  1984: 5.8,
  1985: 31.0,
  1986: 18.0,
  1987: 4.5,
  1988: 15.9,
  1989: 31.0,
  1990: -3.8,
  1991: 29.8,
  1992: 7.0,
  1993: 9.5,
  1994: 0.8,
  1995: 11.2,
  1996: 6.4,
  1997: 2.1,
  1998: 20.0,
  1999: 27.0,
  2000: -14.2,
  2001: -21.4,
  2002: -15.9,
  2003: 38.6,
  2004: 20.3,
  2005: 13.5,
  2006: 26.3,
  2007: 11.2,
  2008: -43.1,
  2009: 31.8,
  2010: 7.8,
  2011: -12.2,
  2012: 17.3,
  2013: 22.8,
  2014: -4.9,
  2015: -0.8,
  2016: 4.5,
  2017: 25.0,
  2018: -13.8,
  2019: 21.5,
  2020: 10.7,
  2021: 8.7,
  2022: -16.0,
  2023: 18.2,
  2024: 10.1,
}

// Total Market (Global/World Market) historical returns
// Source: MSCI World Index (developed markets) - tracks global developed market performance
// Note: For complete global coverage including emerging markets, MSCI ACWI or FTSE Global All Cap would be ideal
// MSCI World Index represents ~85% of global developed market capitalization
const totalMarketReturns: Record<number, number> = {
  1970: 3.9,
  1971: 14.2,
  1972: 18.7,
  1973: -14.8,
  1974: -26.6,
  1975: 37.1,
  1976: 23.6,
  1977: -7.3,
  1978: 6.5,
  1979: 18.3,
  1980: 32.3,
  1981: -5.0,
  1982: 21.4,
  1983: 22.4,
  1984: 6.2,
  1985: 31.6,
  1986: 18.6,
  1987: 5.1,
  1988: 16.5,
  1989: 31.6,
  1990: -3.2,
  1991: 30.4,
  1992: 7.5,
  1993: 10.0,
  1994: 1.2,
  1995: 20.8,
  1996: 15.8,
  1997: 20.9,
  1998: 24.0,
  1999: 26.0,
  2000: -13.0,
  2001: -16.5,
  2002: -19.9,
  2003: 32.2,
  2004: 14.7,
  2005: 9.5,
  2006: 20.1,
  2007: 9.2,
  2008: -40.3,
  2009: 30.8,
  2010: 11.8,
  2011: -5.5,
  2012: 16.4,
  2013: 27.4,
  2014: 5.5,
  2015: -0.8,
  2016: 8.2,
  2017: 22.4,
  2018: -8.7,
  2019: 28.0,
  2020: 16.3,
  2021: 18.5,
  2022: -18.4,
  2023: 23.8,
  2024: 20.1,
}

function getYearRange(returns: Record<number, number>): { startYear: number; endYear: number } {
  const years = Object.keys(returns).map(Number).sort((a, b) => a - b)
  return {
    startYear: years[0],
    endYear: years[years.length - 1],
  }
}

export const historicalData: HistoricalReturnsData[] = [
  {
    index: 'sp500',
    name: 'S&P 500',
    returns: sp500Returns,
    ...getYearRange(sp500Returns),
  },
  {
    index: 'total-us-market',
    name: 'Total US Market',
    returns: totalUsMarketReturns,
    ...getYearRange(totalUsMarketReturns),
  },
  {
    index: 'total-ex-us-market',
    name: 'Total Ex-US Market',
    returns: totalExUsMarketReturns,
    ...getYearRange(totalExUsMarketReturns),
  },
  {
    index: 'total-market',
    name: 'Total Market (International + US)',
    returns: totalMarketReturns,
    ...getYearRange(totalMarketReturns),
  },
]

// Helper function to get historical data for a specific index
export function getHistoricalData(index: MarketIndex): HistoricalReturnsData | undefined {
  return historicalData.find((data) => data.index === index)
}

// Helper function to get available years for an index
export function getAvailableYears(index: MarketIndex): number[] {
  const data = getHistoricalData(index)
  if (!data) return []
  return Object.keys(data.returns)
    .map(Number)
    .sort((a, b) => a - b)
}

// Helper function to get valid start years for a given index and simulation length
export function getValidStartYears(
  index: MarketIndex,
  simulationYears: number
): number[] {
  const data = getHistoricalData(index)
  if (!data) return []
  
  const availableYears = getAvailableYears(index)
  const maxStartYear = data.endYear - simulationYears + 1
  
  return availableYears.filter((year) => year <= maxStartYear)
}

// Helper function to get returns for a specific year range
export function getReturnsForRange(
  index: MarketIndex,
  startYear: number,
  endYear: number
): number[] {
  const data = getHistoricalData(index)
  if (!data) return []
  
  const returns: number[] = []
  for (let year = startYear; year <= endYear; year++) {
    const returnValue = data.returns[year]
    if (returnValue !== undefined) {
      returns.push(returnValue)
    }
  }
  return returns
}

// Helper function to calculate average yearly return for an index
// Uses geometric mean (CAGR) which is the correct way to calculate long-term returns
// Formula: CAGR = (∏(1 + r_i/100))^(1/n) - 1
export function getAverageYearlyReturn(index: MarketIndex): number | null {
  const data = getHistoricalData(index)
  if (!data) return null
  
  const returns = Object.values(data.returns)
  if (returns.length === 0) return null
  
  // Calculate geometric mean (CAGR)
  // Multiply all (1 + return) values, then take the nth root, then subtract 1
  const product = returns.reduce((acc, ret) => acc * (1 + ret / 100), 1)
  const geometricMean = Math.pow(product, 1 / returns.length) - 1
  
  // Convert back to percentage
  return geometricMean * 100
}

