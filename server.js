const express = require('express');
const app = express();
const http = require('http').createServer(app);
const fs = require('fs');
const io = require('socket.io')(http);
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// Create uploads folder if not exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Load chat history if exists
let chatHistory = [];
if (fs.existsSync('chat.json')) {
  try {
    chatHistory = JSON.parse(fs.readFileSync('chat.json'));
  } catch (err) {
    console.error('Error reading chat history:', err);
  }
}

const users = {};

// Emoji map (add more as needed)
const emojiMap = {
  ':smile:': '😄',
  ':laugh:': '😂',
  ':sad:': '😔',
  ':heart:': '❤️',
  ':thumbsup:': '👍',
  ':fire:': '🔥',
  ':100:': '💯',
  ':sob:': '😭',
  ':moan:':'😩',
  ':shocked:':'😮',
  ':sideeye:':'😒',
  '::':'',
  ':slay:':'🫸🫳💅',
  ':urgay:':'🫵🏳️‍🌈',
  ':zestyahh:':'🥴',
  ':skull:':'💀',
  ':eyebrow:':'🤨',
  ':sparkle:':'✨',
  ':nerd:':'🤓',
  
  
  //chair//
  ':chairshake:':'https://cdn.glitch.global/090cdb5f-1954-4c06-b07a-d512a99ab02c/shakechair.gif?1748431133008',
 
  //anarchy//
  ':anarchy:':'https://cdn.glitch.global/090cdb5f-1954-4c06-b07a-d512a99ab02c/anarchy-removebg-preview.png?1748438107078',
  ':anarchyscroll:':'https://cdn.glitch.global/090cdb5f-1954-4c06-b07a-d512a99ab02c/scrollanarchy.gif?1748397630581',
  ':anarchypet:':'https://cdn.glitch.global/090cdb5f-1954-4c06-b07a-d512a99ab02c/petanarchy.gif?1748397115131',
  
  //louis//
  ':louisfire:':'https://cdn.glitch.global/090cdb5f-1954-4c06-b07a-d512a99ab02c/public%2Femojis%2Flouisfire.gif?1748429510069',
  ':louisgun:':'https://cdn.glitch.global/090cdb5f-1954-4c06-b07a-d512a99ab02c/louisgun.gif?1748434205439',
  ':louispet:':'https://cdn.glitch.global/090cdb5f-1954-4c06-b07a-d512a99ab02c/petlouis.gif?1748444317452',
  ':louis:':'https://cdn.glitch.global/090cdb5f-1954-4c06-b07a-d512a99ab02c/louis.gif?1748444921180',
  ':louisshake:':'https://cdn.glitch.global/090cdb5f-1954-4c06-b07a-d512a99ab02c/louisshake.gif?1748444918681',
  ':louisbounce:':'https://cdn.glitch.global/090cdb5f-1954-4c06-b07a-d512a99ab02c/louisbounce.gif?1748445142133',
  ':louisrock:':'https://cdn.glitch.global/090cdb5f-1954-4c06-b07a-d512a99ab02c/louisrock.gif?1748555439736',
  ':louisparty:':'https://cdn.glitch.global/090cdb5f-1954-4c06-b07a-d512a99ab02c/louisparty.gif?1748555442552',
  ':louisglitch:':'https://cdn.glitch.global/090cdb5f-1954-4c06-b07a-d512a99ab02c/louisglitch.gif?1748555449972',
  
  //arc//
  ':arcfire:':'https://cdn.glitch.global/090cdb5f-1954-4c06-b07a-d512a99ab02c/arcfire.gif?1748447093238',
  ':arcgun:':'https://cdn.glitch.global/090cdb5f-1954-4c06-b07a-d512a99ab02c/arcgun.gif?1748447010104',
  ':arcpet:':'https://cdn.glitch.global/090cdb5f-1954-4c06-b07a-d512a99ab02c/arcpet.gif?1748447090495',
  ':arc:':'https://cdn.glitch.global/090cdb5f-1954-4c06-b07a-d512a99ab02c/thumbnails%2Farc.png?1748447006224',
  ':arcshake:':'https://cdn.glitch.global/090cdb5f-1954-4c06-b07a-d512a99ab02c/arcshake.gif?1748447012240',
  ':arcbounce:':'https://cdn.glitch.global/090cdb5f-1954-4c06-b07a-d512a99ab02c/arcbounce.gif?1748447014609',
  
  //sandy//
  ':sandyfire:':'',
  ':sandygun:':'',
  ':sandypet:':'',
  ':sandy:':'',
  ':sandyshake:':'',
  ':sandybounce:':'',
  
  //???//
  '::':'',
  '::':'',
  '::':'',
  '::':'',
  '::':'',
  '::':'',
  
  //???//
  '::':'',
  '::':'',
  '::':'',
  '::':'',
  '::':'',
  '::':'',
  
  
};

// Replace emoji shortcodes with actual emojis


function replaceEmojis(message) {
  for (const [code, val] of Object.entries(emojiMap)) {
    const regex = new RegExp(code.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), 'g');

    if (val.startsWith('http://') || val.startsWith('https://')) {
      // It's an image URL — replace with img tag
      const imgTag = `<img src="${val}" alt="${code}" class="emoji" />`;
      message = message.replace(regex, imgTag);
    } else {
      // It's a unicode emoji — replace with that character
      message = message.replace(regex, val);
    }
  }
  return message;
}



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Upload endpoint for images
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');

  // Get username & color from form data sent by client
  const username = req.body.username || 'Anonymous';
  const color = req.body.color || '#000000';

  const imageUrl = `/uploads/${req.file.filename}`;

  const message = {
    username,
    color,
    message: `<img src="${imageUrl}" alt="uploaded image" style="max-width:200px; max-height:200px;" />`,
    time: new Date()
  };

  chatHistory.push(message);
  fs.writeFile('chat.json', JSON.stringify(chatHistory, null, 2), err => {
    if (err) console.error('Failed to save chat history:', err);
  });

  io.emit('chat message', message);
  res.sendStatus(200);
});

io.on('connection', socket => {
  console.log('User connected:', socket.id);

  // Default username and color, can be updated by client
  users[socket.id] = {
    username: socket.handshake.query.username || 'Anonymous',
    color: socket.handshake.query.color || '#000000'
  };

  // Send chat history & online users list
  socket.emit('chat history', chatHistory);
  io.emit('user list', Object.values(users));

  // Set or update username and color
  socket.on('set user', ({ username, color }) => {
    users[socket.id] = { username, color };
    io.emit('user list', Object.values(users));
  });

  socket.on('chat message', (msg) => {
    const user = users[socket.id] || { username: 'Anonymous', color: '#000000' };
    const trimmedMsg = msg.trim();

    // Command handling
    if (trimmedMsg.startsWith('/')) {
      const parts = trimmedMsg.split(' ');
      const command = parts[0].toLowerCase();

      if (command === '/msg' && parts.length > 2) {
        const targetUsername = parts[1];
        const privateMessage = parts.slice(2).join(' ');

        const targetEntry = Object.entries(users).find(([id, info]) => info.username === targetUsername);

        if (targetEntry) {
          const [targetSocketId] = targetEntry;

          const message = {
            username: user.username,
            color: user.color,
            message: privateMessage,
            time: new Date(),
            private: true
          };

          socket.to(targetSocketId).emit('private message', { ...message, username: user.username, color: user.color });
          socket.emit('private message', { ...message, username: targetUsername, color: users[targetSocketId].color, fromSender: true });
        } else {
          socket.emit('chat message', {
            username: 'System',
            color: '#ff0000',
            message: `User "${targetUsername}" not found.`,
            time: new Date()
          });
        }
      } else if (command === '/clear') {
        if (user.username === 'luca') {
          chatHistory = [];
          fs.writeFile('chat.json', JSON.stringify(chatHistory, null, 2), err => {
            if (err) console.error('Failed to save chat history:', err);
          });
          io.emit('chat history', []); // clear for everyone
        } else {
          socket.emit('chat message', {
            username: 'System',
            color: '#ff0000',
            message: 'You do not have permission to clear the chat.',
            time: new Date()
          });
        }
      } else {
        socket.emit('chat message', {
          username: 'System',
          color: '#ff0000',
          message: `Unknown command: ${command}`,
          time: new Date()
        });
      }
      return; // stop normal message processing
    }

    // Normal message
    const message = {
      username: user.username,
      color: user.color,
      message: replaceEmojis(trimmedMsg),
      time: new Date()
    };

    chatHistory.push(message);
    fs.writeFile('chat.json', JSON.stringify(chatHistory, null, 2), err => {
      if (err) console.error('Failed to save chat history:', err);
    });

    io.emit('chat message', message);
  });

  socket.on('typing', () => {
    const user = users[socket.id];
    if (user) socket.broadcast.emit('typing', user.username);
  });

  socket.on('stop typing', () => {
    const user = users[socket.id];
    if (user) socket.broadcast.emit('stop typing', user.username);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    delete users[socket.id];
    io.emit('user list', Object.values(users));
  });
});

http.listen(process.env.PORT || 3000, () => {
  console.log('Listening on *:3000');
});


