import EightyTwentyCard from '../components/EightyTwentyCard.jsx';
import LastRunCard from '../components/LastRunCard.jsx';
import TrainingLoadCard from '../components/TrainingLoadCard.jsx';
import WeekSummaryCard from '../components/WeekSummaryCard.jsx';

function DashboardPage() {
  const weekSummary = {
    distanceValue: '12',
    distanceUnit: 'km',
    durationValue: '1h40',
    elevationValue: '285',
    elevationUnit: 'm',
  };
  const trainingLoad = {
    fatigueValue: '22.45',
    formValue: '-6.13',
    fitnessValue: '16.32',
    loadValue: '42.5',
  };
  const intensityBalance = {
    label: 'Last 7 days',
    easyPercent: '72%',
    moderatePercent: '10%',
    hardPercent: '18%',
  };
  const lastRun = {
    type: 'Easy',
    surface: 'Treadmill',
    date: 'Wed 8 Apr',
    distance: '6.10 km',
    duration: '50:01',
    elevation: '0 m',
    hr: '134 bpm',
  };

  return (
    <section className="page-card">
      <div className="dashboard-grid">
        <div className="dashboard-grid__top">
          <WeekSummaryCard
            distanceValue={weekSummary.distanceValue}
            distanceUnit={weekSummary.distanceUnit}
            durationValue={weekSummary.durationValue}
            elevationValue={weekSummary.elevationValue}
            elevationUnit={weekSummary.elevationUnit}
          />
          <EightyTwentyCard
            label={intensityBalance.label}
            easyPercent={intensityBalance.easyPercent}
            moderatePercent={intensityBalance.moderatePercent}
            hardPercent={intensityBalance.hardPercent}
          />
          <TrainingLoadCard
            fatigueValue={trainingLoad.fatigueValue}
            formValue={trainingLoad.formValue}
            fitnessValue={trainingLoad.fitnessValue}
            loadValue={trainingLoad.loadValue}
          />
        </div>

        <div className="dashboard-grid__bottom">
          <LastRunCard
            type={lastRun.type}
            surface={lastRun.surface}
            date={lastRun.date}
            distance={lastRun.distance}
            duration={lastRun.duration}
            elevation={lastRun.elevation}
            hr={lastRun.hr}
          />
          <section className="dashboard-card dashboard-card--chart">
            <h3 className="card-title">Annual Distance</h3>
            <div className="chart-placeholder">
              <div className="chart-bars" aria-hidden="true">
                <span style={{ height: '46%' }} />
                <span style={{ height: '52%' }} />
                <span style={{ height: '61%' }} />
                <span style={{ height: '60%' }} />
                <span style={{ height: '100%' }} />
                <span style={{ height: '39%' }} />
                <span style={{ height: '81%' }} />
                <span style={{ height: '50%' }} />
                <span style={{ height: '38%' }} />
                <span style={{ height: '76%' }} />
                <span style={{ height: '79%' }} />
                <span style={{ height: '22%' }} />
              </div>
              <div className="chart-axis">
                <span>Mai</span>
                <span>Juin</span>
                <span>Juil.</span>
                <span>Août</span>
                <span>Sept.</span>
                <span>Oct.</span>
                <span>Nov.</span>
                <span>Déc.</span>
                <span>Jan.</span>
                <span>Fév.</span>
                <span>Mar.</span>
                <span>Avr.</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

export default DashboardPage;
