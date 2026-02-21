import { useEffect, useState } from 'react'
import { BASE_URL } from './config'
import './App.css'
import JobItem from './components/JobItem'

function App() {
  const [candidate, setCandidate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const myemail = "iurdaniz66@gmail.com";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const candidateResponse = await fetch( `${BASE_URL}/api/candidate/get-by-email?email=${myemail}`
      );

      if (!candidateResponse.ok) {
        const error = await candidateResponse.json();
        throw new Error(error.message || "Error fetching candidate: " + myemail);
      }
      const candidateData = await candidateResponse.json();
      setCandidate(candidateData);

      const jobsResponse = await fetch(`${BASE_URL}/api/jobs/get-list`);
      const jobsData = await jobsResponse.json();
      setJobs(jobsData);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

return (
  <div style={{ maxWidth: 600, margin: "0 auto" }}>
    <h1>Posiciones abiertas</h1>

    {jobs.map((job) => (
      <JobItem
        key={job.id}
        job={job}
        candidate={candidate}
      />
    ))}
  </div>
);
}

export default App
