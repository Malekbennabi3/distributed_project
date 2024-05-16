const { error, success, setupApp, tryStartMongoose } = require("./common/util");

const {User, Board} = require("./common/models");
const mongoose = require("mongoose");

async function authUser(req, res, next) {
    let {token} = req.body;
    const response = await fetch(process.env["AUTH_URL"], {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({token}),
    });
    if (response.status !== 200) {
        next(error("Couldn't auth user")); return;
    }
    const data = await response.json();
    if (!data.success) {
        next(error("Couldn't auth user")); return;
    }
    req.user = await User.findOne({login: data.login});
    next();
}

function validId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

async function getBoard(req, res, next) {
    let {boardId} = req.body;
    if (!validId(boardId)) {
        next(error("Couldn't find board")); return;
    }
    let board = await Board.findById(boardId);
    if (!board || (board.author !== req.user.login && !board.public)) {
        next(error("Couldn't find board")); return;
    }
    req.board = board;
    next();
}

tryStartMongoose();

setupApp(app => {
    app.post("/boards", authUser, async (req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        success(res, {
            boards: await Board.find({author: req.user.login})
        });
    });

    app.post("/createBoard", authUser, async (req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        let board = new Board({
            author: req.user.login,
            notes: []
        });
        await board.save();
        success(res, {
            boardId: board._id
        });
    });

    app.post("/board", authUser, getBoard, async (req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        success(res, { board: req.board });
    });

    app.post("/updateBoard", authUser, getBoard, async (req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        if (req.board.author !== req.user.login) {
            next(error("Only the author can modify the board")); return;
        }
        if (req.body.public) {
            req.board.public = req.body.public === "true";
        }
        await req.board.save();
        success(res);
    });

    app.post("/deleteBoard", authUser, getBoard, async (req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        if (req.board.author !== req.user.login) {
            next(error("Only the author can delete the board")); return;
        }
        await req.board.deleteOne();
        success(res);
    });

    app.post("/addNote", authUser, getBoard, async (req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        let {content} = req.body;
        let note = req.board.notes.create({content});
        req.board.notes.push(note);
        await req.board.save();
        success(res, {note});
    });

    app.post("/deleteNote", authUser, getBoard, async (req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        let {noteId} = req.body;
        if (!validId(noteId)) {
            next(error("Bad note id")); return;
        }
        let note = req.board.notes.id(noteId);
        if (!note) {
            next(error("Bad note id")); return;
        }
        note.deleteOne();
        await req.board.save();
        success(res);
    });
});

