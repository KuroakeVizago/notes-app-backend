const { nanoid } = require("nanoid");
const notes = require("./notes");

const addNoteHandler = (request, handler) => {
    
    const { title, tags, body } = request.payload;

    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const cNote = { id, title, tags, body, createdAt, updatedAt };

    notes.push(cNote);

    const isValid = notes.filter((note) => note.id === id).length > 0;

    // Constructing response of this add note request
    let response;

    if (isValid) {
    
        response = handler.response({
            status: "success",
            message: "Note is added",
            data: {
                noteId: id
            },
        });

        response.code(201);
    }
    else{
        response = handler.response({
            status: "fail",
            message: "Failed to add note"
        });
    
        response.code(500);    
    }

     return response;
};

const getAllNotesHandler = () => ({
    status: "success",
    data: {
        notes,
    }
 });

 const getNoteHandler = (request, handler) => {
    const { id } = request.params;

    const note = notes.filter((note) => note.id === id)[0];

    let response;

    if (note === undefined) 
    {
        response = handler.response({
            status: "fail",
            message: "Note is not found"
        });

        response.code(404);
    }
    else
    {
        response = {
            status: "success",
            data: { note }
        };    
    }

    return response;
    
 };

const editNoteHandler = (request, handler) => 
{
    const { id } = request.params;
    const { title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();

    const noteIndex = notes.findIndex((note) => note.id === id);

    let response;

    if (noteIndex < 0) {
        response = handler.response({
            status: "fail",
            message: "Failed to update an data. Id is not found!!!"
        });
        
        response.code(404);
        return response;
    }

    notes[noteIndex].title = title;
    notes[noteIndex].tags = tags;
    notes[noteIndex].body = body;
    notes[noteIndex].updatedAt = updatedAt;

    response = handler.response({
        status: "success",
        message: "Note has been successfully updated"
    });

    response.code(200);
    return response;
};

const deleteNoteHandler = (request, handler) => 
{
    const { id } = request.params;

    const noteIndex = notes.findIndex((note) => note.id === id);

    let response;

    if (noteIndex < 0) {
        response = handler.response({
            status: "fail",
            message: "Failed to delete an data. Id is not found!!!"
        });
        
        response.code(404);
        return response;
    }

    notes.splice(noteIndex, 1);
    response = handler.response({
      status: "success",
      message: "Catatan berhasil dihapus",
    });

    response.code(200);
    return response;

};

module.exports = { 
    addNoteHandler, 
    getAllNotesHandler, 
    getNoteHandler, 
    editNoteHandler, 
    deleteNoteHandler
};