import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCards from "../../components/Cards/NoteCards";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import AddEditNotes from "./AddEditNotes";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import AddNote from "../../assets/images/AddNote.svg";

// Axios
import axiosInstance from "../../utils/axios";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  // Get userInfo
  // Función para obtener la información del usuario logueado
  const getUserInfo = async () => {
    try {
      // Llamada a la nueva ruta /get-user
      const response = await axiosInstance.get("/users/get-user");
      console.log("GET-RESP.DATA.DOC", response.data._doc);

      if (response.data && response.data._doc) {
        setUserInfo(response.data._doc); // Guardar la info en el estado
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/auth/login"); // Redirigir al login
      } else {
        console.error("Error al obtener la información del usuario:", error);
      }
    }
  };

  // Get All Notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/notes/all-notes");
      console.log("ALLNOTES", response.data);

      if (response.data && response.data) {
        setAllNotes(response.data); // Guardar la info en el estado
      }
    } catch (error) {
      console.error("Error inesperado:", error);
    }
  };

  // Delete Note
  const deleteNote = async (noteId) => {
    try {
      const response = await axiosInstance.delete(
        `/notes/delete-note/${noteId}`
      );

      if (response.data) {
        showToastMessage("Note deleted successfully", "delete");
        getAllNotes(); // Actualiza la lista de notas en el frontend
      }
    } catch (error) {
      console.error(
        "Delete note failed",
        error.response?.data || error.message
      );
      setError("Delete note failed");
    }
  };

  const onSearch = async (query) => {
    try {
      const response = await axiosInstance.get(
        `/notes/search-notes?query=${query}`
      );

      if (response.data) {
        setIsSearch(true); // Marcar que estamos en modo búsqueda
        setAllNotes(response.data); // Actualizar la lista de notas con los resultados de búsqueda
      }
    } catch (error) {
      console.error("Error al buscar notas:", error);
    }
  };

  const updateIsPinned = async (noteId, isPinned) => {
    try {
      const response = await axiosInstance.put(`/notes/edit-note-pinned/${noteId}`, {
        isPinned: !isPinned, // Alterna el estado
      });
  
      if (response.data) {
        showToastMessage("Note pin status updated", "update");
        getAllNotes(); // Actualiza la lista de notas en el frontend
      }
    } catch (error) {
      console.error("Failed to update pinned note", error.response?.data || error.message);
    }
  };


  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  useEffect(() => {
    getUserInfo(); // Llamar a la función al montar el componente
    getAllNotes();
    return () => {};
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} onSearch={userInfo ? onSearch : () => {}}/>
      <div className="container mx-auto">
        {allNotes.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mt-8 mx-2">
            {allNotes.map((note, i) => (
              <NoteCards
                key={note._id}
                title={note.title}
                date={note.createdOn}
                content={note.content}
                tags={note.tags}
                isPinned={note.isPinned}
                onEdit={() => handleEdit(note)}
                onDelete={() => deleteNote(note._id)}
                onPinNote={() => updateIsPinned(note._id, note.isPinned)} // Llamada a la función
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            imgSrc={AddNote}
            message={
              isSearch
                ? `Oops! No notes found matching your search.`
                : `Start creating your first note! Click the "Add" button to jot down your thoughts, ideas and reminders. Leṭ's get started!`
            }
          />
        )}
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 right-10 bottom-10 fixed"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgb(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-w-3/4 bg-white rounded-md mx-auto mt-14 p-5"
      >
        <AddEditNotes
          openAddEditModal={openAddEditModal}
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() =>
            setOpenAddEditModal({ isShown: false, type: "add", data: null })
          }
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
