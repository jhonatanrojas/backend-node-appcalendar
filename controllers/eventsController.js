const { response } = require("express");
const { generarJWT } = require("../helpers/jwt");
const Event = require("../models/EventModel");
const User = require("../models/UserModel");


const getEventos = async (req, res = response) => {
    const eventos = await Event.find().populate('user', 'name email');

    res.json({ ok: true, eventos });
};


const crearEvento = async (req, res = response) => {
    const evento = new Event(req.body);

    try {
        evento.user = req.uid;
        const eventoGuardado = await evento.save();
        res.status(201).json({ ok: true, evento: eventoGuardado });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: "Hable con el administrador" });
    }
};

const actualizarEvento = async (req, res = response) => {
    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Event.findById(eventoId);
        if (!evento) {
            return res.status(404).json({ ok: false, msg: "Evento no encontrado" });
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({ ok: false, msg: "No tiene permisos para editar este evento" });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid,
        };

        const eventoActualizado = await Event.findByIdAndUpdate(eventoId, nuevoEvento, { new: true });

        res.json({ ok: true, evento: eventoActualizado });
    } catch (error) {  
        console.log(error);
        res.status(500).json({ ok: false, msg: "Hable con el administrador" });
    }
};

const eliminarEvento = async (req, res = response) => {
    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Event.findById(eventoId);
        if (!evento) {
            return res.status(404).json({ ok: false, msg: "Evento no encontrado" });
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({ ok: false, msg: "No tiene permisos para eliminar este evento" });
        }

        await Event.findByIdAndDelete(eventoId);

        res.json({ ok: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: "Hable con el administrador" });
    }
};

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento,   
};


