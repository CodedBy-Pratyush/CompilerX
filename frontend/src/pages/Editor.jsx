import React, { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import AIFixModal from "../components/AIFixModal";
import Editor2 from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../helper";
import { toast } from "react-toastify";
import { getMonacoLanguage } from "../constants/languages";
import { FiPlay, FiSave } from "react-icons/fi";

const OUTPUT_TITLES = {
  success: "Output",
  compile_error: "Compilation Error",
  runtime_error: "Runtime Error",
  timeout: "Timed Out",
  api_error: "Execution Error",
};

const HISTORY_LABELS = {
  success: "Success",
  compile_error: "Compile Error",
  runtime_error: "Runtime Error",
  timeout: "Timeout",
  api_error: "Error",
};


const OutputPanel = ({ output, outputTitle, isError, onClear }) => (
  <div className="flex-1 p-[15px] overflow-auto border-b-[1px] border-b-border">
    <div className="flex items-center justify-between pb-2">
      <p className={`p-0 m-0 font-medium ${isError ? "text-red-400" : "text-muted"}`}>
        {outputTitle}
      </p>
      <button
        onClick={onClear}
        className="text-[12px] text-muted hover:text-white transition-all"
      >
        Clear
      </button>
    </div>
    <pre
      className={`w-full whitespace-pre-wrap break-words text-[13px] ${isError ? "text-red-400" : "text-[#dcdfe6]"}`}
    >
      {output}
    </pre>
  </div>
);

const HistoryPanel = ({ history }) => (
  <div className="p-[15px] overflow-auto" style={{ maxHeight: "35%" }}>
    <p className="p-0 m-0 pb-2 text-muted font-medium">Execution History</p>
    {history.length === 0 ? (
      <p className="text-[13px] text-muted">No runs yet.</p>
    ) : (
      <div className="flex flex-col gap-[8px]">
        {history.map((entry) => (
          <div key={entry._id} className="bg-surface2 border border-border rounded-[10px] p-2">
            <div className="flex items-center justify-between">
              <span
                className={
                  entry.status === "success"
                    ? "text-green-400 text-[12px] font-medium"
                    : "text-red-400 text-[12px] font-medium"
                }
              >
                {HISTORY_LABELS[entry.status] || entry.status}
              </span>
              <span className="text-[11px] text-muted">
                {new Date(entry.createdAt).toLocaleTimeString()}
              </span>
            </div>
            <pre className="text-[12px] text-muted whitespace-pre-wrap break-words m-0 mt-1 max-h-[60px] overflow-hidden">
              {entry.output || "(no output)"}
            </pre>
          </div>
        ))}
      </div>
    )}
  </div>
);

const Editor = () => {
  const { id } = useParams();

  
  const [code, setCode] = useState("");
  const [project, setProject] = useState(null);

  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");
  const [outputTitle, setOutputTitle] = useState("Output");
  const [isError, setIsError] = useState(false);


  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [history, setHistory] = useState([]);

  
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);


  const lastSavedCodeRef = useRef(null);
  const autosaveTimerRef = useRef(null);

  
  useEffect(() => {
    let cancelled = false;

    const loadProject = async () => {
      try {
        const { data } = await apiFetch("/getProject", {
          method: "POST",
          body: JSON.stringify({ projectId: id }),
        });

        if (cancelled) return;

        if (data.success) {
          setCode(data.project.code);
          setProject(data.project);
          lastSavedCodeRef.current = data.project.code;
          loadHistory(); 
        } else {
          toast.error(data.msg);
        }
      } catch (err) {
        if (!cancelled) toast.error("Failed to load project.");
      }
    };

    loadProject();
    return () => {
      cancelled = true;
    };
  }, [id]);

  
  useEffect(() => {
    if (!project || code === lastSavedCodeRef.current) return;

    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);

    autosaveTimerRef.current = setTimeout(() => {
      saveProject(true);
    }, 1000);

    return () => clearTimeout(autosaveTimerRef.current);
  }, [code, project]);

  
  useEffect(() => {
    const handleSave = (e) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
        saveProject(false); 
      }
    };

    window.addEventListener("keydown", handleSave);
    return () => window.removeEventListener("keydown", handleSave);
  }, []);

  

  const loadHistory = async () => {
    try {
      const { data } = await apiFetch("/getExecutionHistory", {
        method: "POST",
        body: JSON.stringify({ projectId: id }),
      });
      if (data.success) setHistory(data.history);
    } catch (err) {
    
    }
  };

  const saveProject = async (silent = false) => {
    if (!project || code === lastSavedCodeRef.current) return;

    setIsSaving(true);
    try {
      const { data } = await apiFetch("/saveProject", {
        method: "POST",
        body: JSON.stringify({ projectId: id, code }),
      });

      if (data.success) {
        lastSavedCodeRef.current = code;
        if (!silent) toast.success("Saved!");
      } else if (!silent) {
        toast.error(data.msg);
      }
    } catch (err) {
      if (!silent) toast.error("Save failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const runProject = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setOutput("");

    try {
      const { data } = await apiFetch("/execute", {
        method: "POST",
        body: JSON.stringify({ projectId: id, code, stdin }),
      });

      setOutputTitle(OUTPUT_TITLES[data.type] || "Output");
      setIsError(!data.success);
      setOutput(data.output || (data.success ? "(no output)" : "Error"));
      loadHistory();
    } catch (err) {
      setOutputTitle("Execution Error");
      setIsError(true);
      setOutput("Connection failed. Check your internet.");
    } finally {
      setIsRunning(false);
    }
  };


  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

    
      <div className="flex items-center justify-between px-[15px] py-[10px] bg-surface border-b border-border">
        <p className="m-0 font-medium">{project?.name || "Loading..."}</p>
        <div className="flex items-center gap-[10px]">
          <span className="text-[13px] text-muted">
            {isSaving ? "Saving..." : "All saved"}
          </span>
          <button
            className="btnNormal btn-success !w-fit px-[18px] flex items-center gap-2 disabled:opacity-50"
            onClick={() => saveProject(false)}
            disabled={isSaving || !project}
          >
            <FiSave /> {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            className="btnNormal btn-primary !w-fit px-[18px] flex items-center gap-2 disabled:opacity-50"
            onClick={runProject}
            disabled={isRunning || !project}
          >
            <FiPlay /> {isRunning ? "Running..." : "Run"}
          </button>
          <button
            className="btnNormal btn-ai !w-fit px-[18px] flex items-center gap-2"
            onClick={() => setIsAIModalOpen(true)}
          >
            ✨ Fix with AI
          </button>
        </div>
      </div>

      <div
        className="flex items-stretch justify-between"
        style={{ height: "calc(100vh - 140px)" }}
      >
        <div className="w-[50%] h-full">
          <Editor2
            onChange={(newCode) => setCode(newCode || "")}
            theme="vs-dark"
            height="100%"
            width="100%"
            language={getMonacoLanguage(project?.projLanguage)}
            value={code}
            options={{ automaticLayout: true, fontSize: 14 }}
          />
        </div>

        <div className="w-[50%] h-full bg-surface flex flex-col overflow-hidden border-l border-border">
          <div className="p-[15px] border-b-[1px] border-b-border">
            <p className="p-0 m-0 pb-2 text-muted font-medium">Input (stdin)</p>
            <textarea
              className="w-full h-[80px] bg-surface2 border border-border text-white p-2 rounded-[10px] resize-none outline-none focus:border-brand transition-all"
              placeholder="Optional input for your program"
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
            />
          </div>

        
          <OutputPanel
            output={output}
            outputTitle={outputTitle}
            isError={isError}
            onClear={() => {
              setOutput("");
              setOutputTitle("Output");
              setIsError(false);
            }}
          />

       
          <HistoryPanel history={history} />
        </div>
      </div>

     
      <AIFixModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        initialCode={code}
      />
    </div>
  );
};

export default Editor;
