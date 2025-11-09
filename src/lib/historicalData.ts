// Historical total returns data for popular indices
// Data stored as annual returns (as percentages, e.g., 10.5 = 10.5%)
// TODO: Replace mocked values with actual historical data

export type MarketIndex = 'sp500' | 'total-us-market' | 'total-ex-us-market' | 'total-market'

export interface HistoricalReturnsData {
  index: MarketIndex
  name: string
  returns: Record<number, number> // year -> return percentage
  startYear: number
  endYear: number
}

// S&P 500 historical returns (mocked data - replace with actual values)
const sp500Returns: Record<number, number> = {
  1970: 4.0,
  1971: 14.3,
  1972: 18.9,
  1973: -14.7,
  1974: -26.5,
  1975: 37.2,
  1976: 23.8,
  1977: -7.2,
  1978: 6.6,
  1979: 18.4,
  1980: 32.4,
  1981: -4.9,
  1982: 21.5,
  1983: 22.5,
  1984: 6.3,
  1985: 31.7,
  1986: 18.7,
  1987: 5.2,
  1988: 16.6,
  1989: 31.7,
  1990: -3.1,
  1991: 30.5,
  1992: 7.6,
  1993: 10.1,
  1994: 1.3,
  1995: 37.6,
  1996: 23.0,
  1997: 33.4,
  1998: 28.6,
  1999: 21.0,
  2000: -9.1,
  2001: -11.9,
  2002: -22.1,
  2003: 28.7,
  2004: 10.9,
  2005: 4.9,
  2006: 15.8,
  2007: 5.5,
  2008: -37.0,
  2009: 26.5,
  2010: 15.1,
  2011: 2.1,
  2012: 16.0,
  2013: 32.4,
  2014: 13.7,
  2015: 1.4,
  2016: 12.0,
  2017: 21.8,
  2018: -4.4,
  2019: 31.5,
  2020: 18.4,
  2021: 28.7,
  2022: -18.1,
  2023: 26.3,
  2024: 15.0, // Mocked
}

// Total US Market historical returns (mocked data - replace with actual values)
const totalUsMarketReturns: Record<number, number> = {
  1970: 4.2,
  1971: 14.5,
  1972: 19.0,
  1973: -14.5,
  1974: -26.3,
  1975: 37.5,
  1976: 24.0,
  1977: -7.0,
  1978: 6.8,
  1979: 18.6,
  1980: 32.6,
  1981: -4.7,
  1982: 21.7,
  1983: 22.7,
  1984: 6.5,
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
  2024: 15.2, // Mocked
}

// Total Ex-US Market historical returns (mocked data - replace with actual values)
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
  1997: 33.0,
  1998: 28.0,
  1999: 20.5,
  2000: -9.8,
  2001: -12.5,
  2002: -22.8,
  2003: 28.0,
  2004: 10.2,
  2005: 4.2,
  2006: 15.2,
  2007: 4.8,
  2008: -37.8,
  2009: 25.8,
  2010: 14.5,
  2011: 1.5,
  2012: 15.5,
  2013: 31.8,
  2014: 13.0,
  2015: 0.8,
  2016: 11.5,
  2017: 21.2,
  2018: -5.0,
  2019: 30.8,
  2020: 17.8,
  2021: 28.0,
  2022: -18.8,
  2023: 25.8,
  2024: 14.5, // Mocked
}

// Total Market (International + US) historical returns (mocked data - replace with actual values)
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
  1995: 37.5,
  1996: 23.1,
  1997: 33.3,
  1998: 28.5,
  1999: 21.1,
  2000: -9.2,
  2001: -12.0,
  2002: -22.2,
  2003: 28.6,
  2004: 10.8,
  2005: 4.8,
  2006: 15.7,
  2007: 5.4,
  2008: -37.1,
  2009: 26.4,
  2010: 15.0,
  2011: 2.0,
  2012: 16.1,
  2013: 32.3,
  2014: 13.6,
  2015: 1.3,
  2016: 11.9,
  2017: 21.7,
  2018: -4.5,
  2019: 31.4,
  2020: 18.3,
  2021: 28.6,
  2022: -18.2,
  2023: 26.2,
  2024: 14.9, // Mocked
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

