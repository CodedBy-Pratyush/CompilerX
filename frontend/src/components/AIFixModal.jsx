import React, { useState } from "react";
import { apiFetch } from "../helper";
import { toast } from "react-toastify";
import { FiX, FiCopy } from "react-icons/fi";



const AIFixModal = ({ isOpen, onClose, initialCode = "" }) => {
  const [code, setCode] = useState(initialCode);
  const [prompt, setPrompt] = useState("");
  const [provider, setProvider] = useState("groq");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  React.useEffect(() => {
    if (isOpen) setCode(initialCode);
  }, [isOpen, initialCode]);

  if (!isOpen) return null;

  const handleFix = async () => {
    if (!code.trim() || !prompt.trim() || isLoading) return;

    setIsLoading(true);
    setResult("");
    try {
      const { data } = await apiFetch("/fixWithAI", {
        method: "POST",
        body: JSON.stringify({ code, prompt, provider }),
      });

      if (data.success) {
        setResult(data.result);
      } else {
        toast.error(data.msg || "AI request failed.");
      }
    } catch (err) {
      toast.error("Could not reach the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    toast.success("Copied!");
  };

  return (
    <div
      onClick={(e) => {
        if (e.target.classList.contains("aiModelCon")) onClose();
      }}
      className="aiModelCon flex items-center justify-center w-screen h-screen fixed top-0 left-0 bg-[rgba(0,0,0,0.6)] z-50 px-4"
    >
      <div className="card w-full max-w-[640px] max-h-[85vh] flex flex-col p-[22px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">✨ Fix with AI</h3>
          <button onClick={onClose} className="text-muted hover:text-white">
            <FiX size={20} />
          </button>
        </div>

        <div className="overflow-y-auto pr-1">
          {/* Which AI to use */}
          <p className="text-[13px] text-muted mb-1">AI provider</p>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full bg-surface2 border border-border text-white p-[10px] rounded-[10px] outline-none focus:border-brand mb-3"
          >
            <option value="groq">Groq (fast)</option>
            <option value="gemini">Gemini</option>
          </select>

          {/* Code box */}
          <p className="text-[13px] text-muted mb-1">Your code</p>
          <textarea
            className="w-full h-[160px] bg-surface2 border border-border text-white p-2 rounded-[10px] resize-none outline-none focus:border-brand font-mono text-[13px] mb-3"
            placeholder="Paste your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          {/* Prompt box */}
          <p className="text-[13px] text-muted mb-1">What do you want fixed?</p>
          <textarea
            className="w-full h-[70px] bg-surface2 border border-border text-white p-2 rounded-[10px] resize-none outline-none focus:border-brand text-[13px] mb-3"
            placeholder="e.g. Fix the bug that crashes on empty input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button
            onClick={handleFix}
            disabled={isLoading || !code.trim() || !prompt.trim()}
            className="btnNormal btn-primary disabled:opacity-50"
          >
            {isLoading ? "Asking AI..." : "✨ Fix with AI"}
          </button>

          {/* Result */}
          {result && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[13px] text-muted">Result</p>
                <button
                  onClick={copyResult}
                  className="flex items-center gap-1 text-[12px] text-accent hover:text-white"
                >
                  <FiCopy /> Copy
                </button>
              </div>
              <pre className="w-full whitespace-pre-wrap break-words text-[13px] bg-surface2 border border-border rounded-[10px] p-3 max-h-[260px] overflow-auto">
                {result}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIFixModal;
