const calculateDaysAndFactor = (data) => {
  let days, factor;
  switch (data.periodType) {
    case 'days':
      days = data.timeToElapse;
       factor = 2 ** Math.trunc(data.timeToElapse / 3);
    case 'weeks':
      days = data.timeToElapse * 7;
      factor = 2 ** Math.trunc(days / 3);
    default:
      days = data.timeToElapse * 30;
      factor = 2 ** Math.trunc(days / 3);
  }
  return { days, factor }
}

  const impactCurrentlyinfected = data => data.reportedCases * 10;
  const severeImpactCurrentlyinfected = data => data.reportedCases * 50;

 const impactInfestionsByRequestTime = data => {
   const { factor } = calculateDaysAndFactor(data);
   return impactCurrentlyinfected(data) * factor;
 }
 const severeImpactInfestionsByRequestTime = data => {
   const { factor } = calculateDaysAndFactor(data);
   return severeImpactCurrentlyinfected(data) * factor;
 }

  const impactSevereCasesByRequestedTime = data =>  Math.trunc((15 / 100) * impactInfestionsByRequestTime(data));
  // eslint-disable-next-line max-len
  const severeImpactSevereCasesByRequestedTime = data => Math.trunc((15 / 100) * severeImpactInfestionsByRequestTime(data));

  const availableBed = data => data.totalHospitalBeds * (35 / 100);
  // eslint-disable-next-line max-len
  const impactHospitalBedsByRequestedTime = data => Math.trunc(availableBed(data) - impactSevereCasesByRequestedTime(data));
  // eslint-disable-next-line max-len
  const severeImpactHospitalBedsByRequestedTime = data => Math.trunc(availableBed(data) - severeImpactSevereCasesByRequestedTime(data));

  const impactCasesForICUByRequestedTime = data => Math.floor((5 / 100) * impactInfestionsByRequestTime(data));
  // eslint-disable-next-line max-len
  const severeImpactCasesForICUByRequestedTime = data => Math.floor((5 / 100) * severeImpactInfestionsByRequestTime(data));
  // eslint-disable-next-line max-len
  const impactCasesForVentilatorsByRequestedTime = data => Math.floor((2 / 100) * impactInfestionsByRequestTime(data));
  // eslint-disable-next-line max-len
  const severeImpactCasesForVentilatorsByRequestedTime = data => Math.floor((2 / 100) * severeImpactInfestionsByRequestTime(data));

  // eslint-disable-next-line max-len
  const impactDollarsInFlight = data => {
    const { days } = calculateDaysAndFactor(data);
    const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = data.region;
    Math.trunc((impactInfestionsByRequestTime(data) * avgDailyIncomeInUSD * avgDailyIncomePopulation) / days);
  }
  // eslint-disable-next-line max-len
  const severeImpactDollarsInFlight = data => {
    const { days } = calculateDaysAndFactor(data);
    const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = data.region;
    Math.trunc((severeImpactInfestionsByRequestTime(data) * avgDailyIncomeInUSD * avgDailyIncomePopulation) / days);
  }

const covid19ImpactEstimator = data => {
  return {
    data,
    impact: {
      currentlyInfected: impactCurrentlyinfected(data),
      infectionsByRequestedTime: impactInfestionsByRequestTime(data),
      severeCasesByRequestedTime: impactSevereCasesByRequestedTime(data),
      hospitalBedsByRequestedTime: impactHospitalBedsByRequestedTime(data),
      casesForICUByRequestedTime: impactCasesForICUByRequestedTime(data),
      casesForVentilatorsByRequestedTime: impactCasesForVentilatorsByRequestedTime(data),
      dollarsInFlight: impactDollarsInFlight(data)
    },
    severeImpact: {
      currentlyInfected: severeImpactCurrentlyinfected(data),
      infectionsByRequestedTime: severeImpactInfestionsByRequestTime(data),
      severeCasesByRequestedTime: severeImpactSevereCasesByRequestedTime(data),
      hospitalBedsByRequestedTime: severeImpactHospitalBedsByRequestedTime(data),
      casesForICUByRequestedTime: severeImpactCasesForICUByRequestedTime(data),
      casesForVentilatorsByRequestedTime: severeImpactCasesForVentilatorsByRequestedTime(data),
      dollarsInFlight: severeImpactDollarsInFlight(data)
    }
  };
}

