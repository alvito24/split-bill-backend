const express = require('express');
const { rooms } = require('../store');
const { validateNumericBody } = require('../middleware/validator');

const router = express.Router();

// ROUTE 1 — POST /api/rooms
router.post('/', validateNumericBody('taxPercent', 'servicePercent'), (req, res) => {
  const { name, taxPercent, servicePercent, members } = req.body;
  
  if (!members || !Array.isArray(members) || members.length === 0) {
    return res.status(400).json({ error: 'Members must be a non-empty array' });
  }
  
  const roomId = Date.now().toString(36);
  const room = {
    id: roomId,
    name,
    items: [],
    taxPercent,
    servicePercent,
    members
  };
  
  rooms[roomId] = room;
  res.status(201).json({ roomId, room });
});

// ROUTE 2 — GET /api/rooms/:roomId
router.get('/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = rooms[roomId];
  
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  const totalItemsPrice = room.items.reduce((sum, item) => sum + item.price, 0);
  const taxAmount = totalItemsPrice * (room.taxPercent / 100);
  const serviceAmount = totalItemsPrice * (room.servicePercent / 100);
  
  const summary = {};
  room.members.forEach(member => {
    const subtotal = room.items
      .filter(item => item.claimedBy === member)
      .reduce((sum, item) => sum + item.price, 0);
    
    const proportion = totalItemsPrice > 0 ? subtotal / totalItemsPrice : 0;
    const tax = proportion * taxAmount;
    const service = proportion * serviceAmount;
    const total = subtotal + tax + service;
    
    summary[member] = { subtotal, tax, service, total };
  });
  
  res.status(200).json({ ...room, summary });
});

// ROUTE 3 — POST /api/rooms/:roomId/claim
router.post('/:roomId/claim', (req, res) => {
  const { roomId } = req.params;
  const { itemId, memberName } = req.body;
  
  if (!itemId || !memberName) {
    return res.status(400).json({ error: 'itemId and memberName are required' });
  }
  
  const room = rooms[roomId];
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  const item = room.items.find(i => i.id === itemId);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  if (item.claimedBy) {
    return res.status(409).json({ error: 'Item already claimed' });
  }
  
  item.claimedBy = memberName;
  res.status(200).json({ success: true, item });
});

// ROUTE EXTRA — POST /api/rooms/:roomId/items
router.post('/:roomId/items', validateNumericBody('price'), (req, res) => {
  const { roomId } = req.params;
  const { name, price } = req.body;
  
  const room = rooms[roomId];
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  const itemId = Math.random().toString(36).slice(2);
  const item = {
    id: itemId,
    name,
    price,
    claimedBy: null
  };
  
  room.items.push(item);
  res.status(201).json(item);
});

module.exports = router;
