import React, { useState, useEffect} from "react";
import { IoMdClose } from "react-icons/io";
import TagInput from "../../components/Input/TagInput";
import axiosInstance from "../../utils/axios";
import { useNavigate } from "react-router-dom";

const AddEditNotes = ({
  onClose,
  type,
  noteData,
  setOpenAddEditModal,
  getAllNotes,
  addNoteToState,
  showToastMessage
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

    // Cargar datos de la nota en el formulario si el tipo es "edit"
    useEffect(() => {
      if (type === "edit" && noteData) {
        setTitle(noteData.title || "");
        setContent(noteData.content || "");
        setTags(noteData.tags || []);
      }
    }, [type, noteData]);

  // AddNote
  const AddNote = async () => {
    try {
      const response = await axiosInstance.post("/notes/add-note", {
        title,
        content,
        tags,
      });

      if (response.data && response.data) {
        showToastMessage("Note added Succefully")
        getAllNotes()
      }

      console.log("addNote successful", response.data);

      // Opcionalmente, redirige a otra página tras el login exitoso
      // navigate("/"); // Puedes cambiar la ruta según sea necesario
    } catch (error) {
      console.error("Add note failed", error.response?.data || error.message);
      setError(error.response?.data?.error || "Add note failed");
    }
  };

  // Edit Note
  const EditNote = async () => {
    try {
      const response = await axiosInstance.put(`/notes/edit-note/${noteData._id}`, {
        title,
        content,
        tags,
      });

      if (response.data) {
        showToastMessage("Note updated Succefully")
        getAllNotes(); // Actualiza la lista de notas en el frontend
      }
    } catch (error) {
      console.error("Edit note failed", error.response?.data || error.message);
      setError("Edit note failed");
    }
  };

  
  

  
 
  const handleAddNote = async (e) => {
    e.preventDefault();

    if (!title) {
      setError("Escriba un titulo por favor");
      return;
    }

    if (!content) {
      setError("Escribe un contenido por favor");
      return;
    }
    setError("");

    if (type === "edit") {
      EditNote();
    } else {
       AddNote();
    }
    onClose();
  };




  return (
    <div className="relative">
      <IoMdClose
        className="absolute right-2 top-2 text-[20px] cursor-pointer text-slate-400 hover:text-slate-500 transition-all delay-200"
        onClick={onClose}
      />
      <div className="flex flex-col gap-2">
        <label className="input-label">TITLE</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Gym a las 17"
          value={title}
          onChange={({ target }) => {
            setTitle(target.value);
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="input-label">CONTENT</label>
        <textarea
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="content"
          rows={10}
          value={content}
          onChange={({ target }) => {
            setContent(target.value);
          }}
        />
      </div>

      <div className="m-3">
        <label className="input-label">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleAddNote}
      >
       {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNotes;
