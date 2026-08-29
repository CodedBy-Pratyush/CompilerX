import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Navbar from "../components/Navbar";
import Select from 'react-select';
import { apiFetch } from '../helper';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { SUPPORTED_LANGUAGES, LANGUAGE_CONFIG, getLanguageLogo } from '../constants/languages';

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#0b0d14',
    borderColor: state.isFocused ? '#6d5bfa' : '#242a3a',
    boxShadow: 'none',
    padding: '4px',
    borderRadius: '12px',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#12151f',
    border: '1px solid #242a3a',
    color: '#fff',
    width: "100%",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#1b1f2c' : '#12151f',
    color: '#fff',
    cursor: 'pointer',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#fff',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#8891a7',
  }),
};

const LANGUAGE_OPTIONS = SUPPORTED_LANGUAGES.map((key) => ({
  label: LANGUAGE_CONFIG[key].label,
  value: key,
}));

const Home = () => {
  const [isCreateModelShow, setIsCreateModelShow] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const [isEditModelShow, setIsEditModelShow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fullName, setFullName] = useState("");
  const [projects, setProjects] = useState(null);
  const [name, setName] = useState("");
  const [editProjId, setEditProjId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const getProjects = useCallback(async () => {
    const { data } = await apiFetch("/getProjects", { method: "POST" });
    if (data.success) {
      setProjects(data.projects);
    } else {
      toast.error(data.msg);
    }
  }, []);

  const getMe = useCallback(async () => {
    const { data } = await apiFetch("/auth/me");
    if (data.success) setFullName(data.user.fullName);
  }, []);

  useEffect(() => {
    getProjects();
    getMe();
  }, [getProjects, getMe]);

  const visibleProjects = useMemo(() => {
    if (!projects) return projects;
    const term = searchTerm.trim().toLowerCase();
    if (!term) return projects;
    return projects.filter((project) => project.name.toLowerCase().includes(term));
  }, [projects, searchTerm]);

  const handleLanguageChange = (selectedOption) => {
    setSelectedLanguage(selectedOption);
  };

  const closeModals = () => {
    setIsCreateModelShow(false);
    setIsEditModelShow(false);
    setName("");
    setSelectedLanguage(null);
    setEditProjId("");
  };

  const createProj = async () => {
    if (!name.trim() || !selectedLanguage || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const { data } = await apiFetch("/createProj", {
        method: "POST",
        body: JSON.stringify({
          name,
          projLanguage: selectedLanguage.value,
        }),
      });
      if (data.success) {
        closeModals();
        navigate("/editor/" + data.projectId);
      } else {
        toast.error(data.msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProject = async (id) => {
    const conf = confirm("Are you sure you want to delete this project?");
    if (!conf) return;
    const { data } = await apiFetch("/deleteProject", {
      method: "POST",
      body: JSON.stringify({ projectId: id }),
    });
    if (data.success) {
      getProjects();
    } else {
      toast.error(data.msg);
    }
  };

  const updateProj = async () => {
    if (!name.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const { data } = await apiFetch("/editProject", {
        method: "POST",
        body: JSON.stringify({ projectId: editProjId, name }),
      });
      if (!data.success) toast.error(data.msg);
      closeModals();
      getProjects();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <div className="flex flex-wrap gap-4 items-center px-[6vw] justify-between mt-8">
        <h3 className='text-2xl font-semibold'>👋 Hi{fullName ? `, ${fullName}` : ""}</h3>
        <div className="flex items-center gap-[12px]">
          <div className="flex items-center gap-2 bg-surface border border-border px-[15px] py-[10px] rounded-[10px] focus-within:border-brand transition-all">
            <FiSearch className="text-muted" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-white outline-none w-[180px]"
            />
          </div>
          <button onClick={() => { setIsCreateModelShow(true) }} className="btnNormal btn-primary !w-fit flex items-center gap-2 px-[18px]">
            <FiPlus /> Create Project
          </button>
        </div>
      </div>

      <div className="projects px-[6vw] mt-6 pb-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {
          visibleProjects === null ? null :
          visibleProjects.length > 0 ? visibleProjects.map((project) => {
            const logo = getLanguageLogo(project.projLanguage);
            return (
              <div key={project._id} className="project rounded-[14px] w-full p-[16px] flex items-center justify-between">
                <div onClick={() => { navigate("/editor/" + project._id) }} className='flex w-full items-center gap-[15px] cursor-pointer'>
                  {logo && <img className='w-[56px] h-[56px] object-contain bg-surface2 rounded-[10px] p-2' src={logo} alt="" />}
                  <div>
                    <h3 className='text-lg font-medium'>{project.name}</h3>
                    <p className='text-[13px] text-muted'>{new Date(project.date).toDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-[10px]">
                  <button className="btnNormal btn-outline !w-fit px-[16px]" onClick={() => {
                    setIsEditModelShow(true);
                    setEditProjId(project._id);
                    setName(project.name);
                  }}>Edit</button>
                  <button onClick={() => { deleteProject(project._id) }} className="btnNormal btn-danger !w-fit px-[16px]">Delete</button>
                </div>
              </div>
            );
          }) : <p className='text-muted col-span-full'>{searchTerm ? "No projects match your search." : "No projects yet — create your first one!"}</p>
        }
      </div>

      {
        isCreateModelShow &&
        <div onClick={(e) => {
          if (e.target.classList.contains("modelCon")) closeModals();
        }} className='modelCon flex flex-col items-center justify-center w-screen h-screen fixed top-0 left-0 bg-[rgba(0,0,0,0.6)] z-50'>
          <div className="modelBox card flex flex-col items-start p-[24px] w-[92vw] max-w-[420px] shadow-soft">
            <h3 className='text-xl font-semibold'>Create Project</h3>
            <div className="inputBox">
              <input onChange={(e) => { setName(e.target.value) }} value={name} type="text" placeholder='Enter your project name' />
            </div>
            <Select
              placeholder="Select a Language"
              options={LANGUAGE_OPTIONS}
              styles={customStyles}
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="w-full"
            />
            {selectedLanguage && (
              <>
                <p className="text-[14px] text-accent mt-2">
                  Selected Language: {selectedLanguage.label}
                </p>
                <button disabled={isSubmitting} onClick={createProj} className="btnNormal btn-primary mt-2">
                  {isSubmitting ? "Creating..." : "Create"}
                </button>
              </>
            )}
          </div>
        </div>
      }

      {
        isEditModelShow &&
        <div onClick={(e) => {
          if (e.target.classList.contains("modelCon")) closeModals();
        }} className='modelCon flex flex-col items-center justify-center w-screen h-screen fixed top-0 left-0 bg-[rgba(0,0,0,0.6)] z-50'>
          <div className="modelBox card flex flex-col items-start p-[24px] w-[92vw] max-w-[420px] shadow-soft">
            <h3 className='text-xl font-semibold'>Update Project</h3>
            <div className="inputBox">
              <input onChange={(e) => { setName(e.target.value) }} value={name} type="text" placeholder='Enter your project name' />
            </div>

            <button disabled={isSubmitting} onClick={updateProj} className="btnNormal btn-primary mt-2">
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      }
    </div>
  );
};

export default Home;
