import { useState } from "react";
import { BASE_URL } from "../config";

export default function JobItem({ job,candidate }) {
    const [repoUrl, setRepoUrl] = useState(null);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        const url = (repoUrl ?? "").trim();
        if (!url) {
            setError("Ingresá la URL de tu repositorio de GitHub");
            return;
        }

        try {
            setStatus("loading");
            setError("");

            const candidateId = candidate.candidateId ?? candidate.candidate_id;
            const applicationId = candidate.applicationId ?? candidate.application_id;
            const body = {
                uuid: candidate.uuid ?? "",
                jobId: job.id ?? "",
                candidateId: candidateId ?? "",
                applicationId,
                repoUrl: url,
            };

            const res = await fetch(`${BASE_URL}/api/candidate/apply-to-job`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
          const text = await res.text();
          let data = {};
          try {
            data = text ? JSON.parse(text) : {};
          } catch {
            throw new Error("Error parsing response");
          }

          if (!res.ok) {
            throw new Error(data.message || data.error || `Error ${res.status}: ${text || res.statusText}`);
          }
    
          setStatus("success");
        } catch (err) {
          setStatus("error");
          setError(err.message || "Error submitting application");
        }
        };

  return (
    <div style={{ border: "1px solid #ccc", padding: 16, marginBottom: 12 }}>
      <h3>{job.title}</h3>

      <input
        type="text"
        placeholder="https://github.com/urda98/nimble-gravity-fullstack-challenge"
        value={repoUrl ?? ""}
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
