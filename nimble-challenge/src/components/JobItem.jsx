import { useState } from "react";
import { BASE_URL } from "../config";

export default function JobItem({ job,candidate }) {
    const [repoUrl, setRepoUrl] = useState(null);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        try {
            setStatus("loading");
            setError("");

            const res = await fetch(`${BASE_URL}/api/candidate/apply-to-job`,
                {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({
                    uuid: candidate.uuid,
                    jobId: job.id,
                    candidateId: candidate.candidateId,
                    repoUrl,
                }),
            }
          );
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || "Error submitting application");
          }
    
          setStatus("success");
        } catch (err) {
          setStatus("error");
          setError(err.message);
        }
        };

  return (
    <div style={{ border: "1px solid #ccc", padding: 16, marginBottom: 12 }}>
      <h3>{job.title}</h3>

      <input
        type="text"
        placeholder="https://github.com/urda98/nimble-gravity-fullstack-challenge.git"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />

      <button onClick={handleSubmit} disabled={status === "loading"}>
        {status === "loading" ? "Submitting..." : "Submit"}
      </button>

      {status === "success" && <p style={{ color: "green" }}>✔ Aplicación enviada</p>}
      {status === "error" && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
    }
