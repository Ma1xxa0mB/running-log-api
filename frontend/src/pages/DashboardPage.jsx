import { useEffect, useState } from 'react';
import ChartDashboard from '../components/ChartDashboard.jsx';
import EightyTwentyCard from '../components/EightyTwentyCard.jsx';
import LastRunCard from '../components/LastRunCard.jsx';
import TrainingLoadCard from '../components/TrainingLoadCard.jsx';
import WeekSummaryCard from '../components/WeekSummaryCard.jsx';
import { fetchRuns } from '../api/runsApi.js';
import { buildEightyTwentyFromRuns } from '../features/dashboard/buildEightyTwentyFromRuns.js';
import { buildAnnualDistanceFromRuns } from '../features/dashboard/buildAnnualDistanceFromRuns.js';
import { buildLastRunFromRuns } from '../features/dashboard/buildLastRunFromRuns.js';
import { buildTrainingLoadFromRunsAndProfile } from '../features/dashboard/buildTrainingLoadFromRunsAndProfile.js';
import { buildWeekSummaryFromRuns } from '../features/dashboard/buildWeekSummaryFromRuns.js';
import { fetchCurrentUser } from '../api/userApi.js';

function DashboardPage() {
  // STEP 2
  // ACTION: STORE
  // DATA: PAGE STATE DATA
  // NAME: runs
  // TYPE: array of run objects
  // CODE ORIGIN: const [runs, setRuns] = useState([])
  const [runs, setRuns] = useState([]);
  const [runsLoading, setRunsLoading] = useState(true);
  const [runsError, setRunsError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserLoading, setCurrentUserLoading] = useState(true);
  const [currentUserError, setCurrentUserError] = useState('');

  useEffect(() => {
    async function loadRuns() {
      try {
        // STEP 1
        // ACTION: FETCH
        // DATA: API DATA
        // NAME: runsResponse
        // TYPE: array of run objects
        // CODE ORIGIN: response.json()
        const result = await fetchRuns();
        setRuns(result);
      } catch (error) {
        setRunsError(error.message);
      } finally {
        setRunsLoading(false);
      }
    }

    loadRuns();
  }, []);

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const user = await fetchCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        setCurrentUserError(error.message);
      } finally {
        setCurrentUserLoading(false);
      }
    }

    loadCurrentUser();
  }, []);

  // STEP 10
  // ACTION: PASS
  // DATA: FEATURE DATA
  // NAME: weekSummary props
  // TYPE: object
  // CODE ORIGIN: <WeekSummaryCard {...weekSummary} />
  const weekSummary = runsLoading || runsError
    ? {
        distanceValue: '--',
        distanceUnit: 'km',
        durationValue: '--',
        elevationValue: '--',
        elevationUnit: 'm',
      }
    : buildWeekSummaryFromRuns(runs);
  const trainingLoad = runsLoading || runsError || currentUserLoading || currentUserError
    ? {
        fatigueValue: '--',
        formValue: '--',
        fitnessValue: '--',
        loadValue: '--',
      }
    : buildTrainingLoadFromRunsAndProfile(runs, currentUser);
  const intensityBalance = runsLoading || runsError
    ? {
        label: 'Last 7 days',
        easyPercent: '0%',
        moderatePercent: '0%',
        hardPercent: '0%',
      }
    : buildEightyTwentyFromRuns(runs);
  const lastRun = runsLoading || runsError
    ? {
        type: '--',
        badgeTone: 'easy-dark',
        cardTone: 'easy',
        surface: '--',
        date: '--',
        distance: '--',
        duration: '--',
        elevation: '--',
        hr: '--',
      }
    : buildLastRunFromRuns(runs);
  const annualDistance = runsLoading || runsError
    ? [
        { label: 'May', km: 0 },
        { label: 'Jun', km: 0 },
        { label: 'Jul', km: 0 },
        { label: 'Aug', km: 0 },
        { label: 'Sep', km: 0 },
        { label: 'Oct', km: 0 },
        { label: 'Nov', km: 0 },
        { label: 'Dec', km: 0 },
        { label: 'Jan', km: 0 },
        { label: 'Feb', km: 0 },
        { label: 'Mar', km: 0 },
        { label: 'Apr', km: 0 },
      ]
    : buildAnnualDistanceFromRuns(runs);

  return (
    <section className="page-card">
      <div className="dashboard-grid">
        <div className="dashboard-grid__top">
          {/* STEP 11
              ACTION: RENDER
              DATA: UI DATA
              NAME: week summary card
              TYPE: rendered UI block
              CODE ORIGIN: WeekSummaryCard */}
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
            unclassifiedPercent={intensityBalance.unclassifiedPercent}
          />
          <TrainingLoadCard
            fatigueValue={trainingLoad.fatigueValue}
            formValue={trainingLoad.formValue}
            fitnessValue={trainingLoad.fitnessValue}
          />
        </div>

        <div className="dashboard-grid__bottom">
          <LastRunCard
            id={lastRun.id}
            type={lastRun.type}
            badgeTone={lastRun.badgeTone}
            cardTone={lastRun.cardTone}
            surface={lastRun.surface}
            date={lastRun.date}
            distance={lastRun.distance}
            duration={lastRun.duration}
            elevation={lastRun.elevation}
            hr={lastRun.hr}
            avgPace={lastRun.avgPace}
            maxHr={lastRun.maxHr}
          />
          <ChartDashboard chartData={annualDistance} />
        </div>
      </div>
    </section>
  );
}

export default DashboardPage;
