const samplePostsData = [
    {
      _id: "001",
      username: "AlexHeals",
      name: "Ales Heaxls",
      title: "Want the peer for Front-End dev",
      description: "Seeking a skilled Front-End developer to collaborate on exciting projects. Aspire to join forces with someone passionate about crafting captivating user experiences through elegant code and innovative design. Together, we'll dive into the realm of web development, harnessing the power of HTML, CSS, and JavaScript to bring visions to life. Let's embark on a journey of creativity, problem-solving, and continuous learning, pushing the boundaries of what's possible in the digital landscape. If you're driven, creative, and ready to embark on this collaborative adventure, let's connect and make waves in the world of Front-End development!  Seeking a skilled Front-End developer to collaborate on exciting projects. Aspire to join forces with someone passionate about crafting captivating user experiences through elegant code and innovative design. Together, we'll dive into the realm of web development, harnessing the power of HTML, CSS, and JavaScript to bring visions to life. Let's embark on a journey of creativity, problem-solving, and continuous learning, pushing the boundaries of what's possible in the digital landscape. If you're driven, creative, and ready to embark on this collaborative adventure, let's connect and make waves in the world of Front-End development!  ",
      creator: "user._id",
      views: "69",
      likes: ["001", "002", "006"],
      dislikes: ["003", "004", "005"],
      avatar: {
        public_id: '12345',
        url: 'https://fastly.picsum.photos/id/64/4326/2884.jpg?hmac=9_SzX666YRpR_fOyYStXpfSiJ_edO3ghlSRnH2w09Kg',
      },
      createdAt: '2024-04-16T07:31:00',
    },
    {
      _id: "002",
      username: "johnDoe",
      name: "John Doe",
      title: "Looking for React Developer",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      views: "69",
      likes: ["001", "002", "006"],
      dislikes: ["003", "004", "005"],
      avatar: {
        public_id: '67890',
        url: 'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?q=80&w=1966&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      createdAt: '2024-04-17T09:45:00',
    },
    {
      _id: "003",
      username: "JeneDan",
      name: "Jene Doe",
      title: "Need Help with Backend Project",
      description: "Vestibulum maximus quam id felis luctus viverra.",
      views: "69",
      likes: ["001", "002", "006"],
      dislikes: ["003", "004", "005"],
      avatar: {
        public_id: '13579',
        url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      createdAt: '2024-04-18T15:20:00',
    },
    {
      _id: "004",
      username: "alexSmith",
      name: "Alex Smith",
      title: "Hiring Full-Stack Developer",
      description: "Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna.",
      views: "69",
      likes: ["001", "002", "006"],
      dislikes: ["003", "004", "005"],
      avatar: {
        public_id: '24680',
        url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      createdAt: '2024-04-19T12:00:00',
    },
    {
      _id: "005",
      username: "saraJohnson",
      name: "Sara Johnson",
      title: "Looking for Graphic Designer",
      description: "Need a talented graphic designer for a new project. Must be proficient in Adobe Creative Suite.",
      views: "69",
      likes: ["001", "002", "006"],
      dislikes: ["003", "004", "005"],
      avatar: {
        public_id: '97531',
        url: 'https://plus.unsplash.com/premium_photo-1688350808212-4e6908a03925?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      createdAt: '2024-02-20T10:15:00',
    },
    {
      _id: "006",
      username: "mikeWilliams",
      name: "Mike Williams",
      title: "Web Developer Needed for E-commerce Project",
      description: "Hiring a web developer with experience in building e-commerce websites using React and Node.js.",
      views: "69",
      likes: ["001", "002", "006"],
      dislikes: ["003", "004", "005"],
      avatar: {
        public_id: '86420',
        url: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      createdAt: '2024-04-01T14:30:00',
    },
    {
      _id: "007",
      username: "laraBrown",
      name: "Lara Brown",
      title: "Seeking Freelance Copywriter",
      description: "Looking for a skilled copywriter to create compelling content for our marketing campaigns.",
      views: "69",
      likes: ["001", "002", "006"],
      dislikes: ["003", "004", "005"],
      avatar: {
        public_id: '75309',
        url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      createdAt: '2024-01-22T09:00:00',
    },
    {
      _id: "008",
      username: "chrisRoberts",
      name: "Chris Roberts",
      title: "Mobile App Developer Wanted",
      description: "We're in need of a mobile app developer to build an innovative app for iOS and Android platforms.",
      views: "69",
      likes: ["001", "002", "006"],
      dislikes: ["003", "004", "005"],
      avatar: {
        public_id: '64258',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      createdAt: '2023-04-23T12:45:00',
    }
    
];


const sampleChatList = [
  {
    _id: "001",
    username: "AlexHeals",
    name: "Ales Heaxls",
    avatar: {
      public_id: '12345',
      url: 'https://fastly.picsum.photos/id/64/4326/2884.jpg?hmac=9_SzX666YRpR_fOyYStXpfSiJ_edO3ghlSRnH2w09Kg',
    },
    lastMessage:{
      sender: "001",
      receiver: "111",
      content: "dfadfa",
      createdAt: "2024-04-16T07:31:00",
    },
  },
  {
    _id: "004",
    username: "alexSmith",
    name: "Alex Smith",
    avatar: {
      public_id: '24680',
      url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    lastMessage:{
      sender: "001",
      receiver: "111",
      content: "ierqncdaoonesn",
      createdAt: "2024-04-16T07:31:00",
    },
    createdAt: '2024-04-19T12:00:00',
  },
  {
    _id: "005",
    username: "saraJohnson",
    name: "Sara Johnson",avatar: {
      public_id: '97531',
      url: 'https://plus.unsplash.com/premium_photo-1688350808212-4e6908a03925?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    lastMessage:{
      sender: "111",
      receiver: "005",
      content: "lavadkk kfhi diahei oaoe aifoena dcahkoneico anef aifan neoa ",
      createdAt: "2024-04-16T07:31:00",
    },
    createdAt: '2024-02-20T10:15:00',
  },
  {
    _id: "006",
    username: "mikeWilliams",
    name: "Mike Williams",
    avatar: {
      public_id: '86420',
      url: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    lastMessage:{
      sender: "006",
      receiver: "111",
      content: "l,3la 3lan3an",
      createdAt: "2024-04-16T07:31:00",
    },
    createdAt: '2024-04-01T14:30:00',
  },
]

const sampleSelectedUser = {
  _id: "chatId",
  username: "alexSmith",
  name: "Alex Smith",
  bio: "this si alex bio",
  isOnline: false,
  lastActive: '2024-04-22T07:31:00',
  avatar: {
    public_id: '24680',
    url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
}

const sampleuserProfile = {
  _id: "user._id",
  username: "alexSmith",
  name: "Alex Smith",
  bio: "this is alex bio",
  isOnline: false,
  lastActive: '2024-04-22T07:31:00',
  totalViews: "134",
  totalLikes: "69",
  totalDislikes: "3",
  posts: [
    {
      _id: "001",
      username: "AlexHeals",
      name: "Ales Heaxls",
      title: "Want the peer for Front-End dev",
      description: "Seeking a skilled Front-End developer to collaborate on exciting projects. Aspire to join forces with someone passionate about crafting captivating user experiences through elegant code and innovative design. Together, we'll dive into the realm of web development, harnessing the power of HTML, CSS, and JavaScript to bring visions to life. Let's embark on a journey of creativity, problem-solving, and continuous learning, pushing the boundaries of what's possible in the digital landscape. If you're driven, creative, and ready to embark on this collaborative adventure, let's connect and make waves in the world of Front-End development!  Seeking a skilled Front-End developer to collaborate on exciting projects. Aspire to join forces with someone passionate about crafting captivating user experiences through elegant code and innovative design. Together, we'll dive into the realm of web development, harnessing the power of HTML, CSS, and JavaScript to bring visions to life. Let's embark on a journey of creativity, problem-solving, and continuous learning, pushing the boundaries of what's possible in the digital landscape. If you're driven, creative, and ready to embark on this collaborative adventure, let's connect and make waves in the world of Front-End development!  ",
      creator: "user._id",
      views: "69",
      likes: ["001", "002", "006"],
      dislikes: ["003", "004", "005"],
      avatar: {
        public_id: '12345',
        url: 'https://fastly.picsum.photos/id/64/4326/2884.jpg?hmac=9_SzX666YRpR_fOyYStXpfSiJ_edO3ghlSRnH2w09Kg',
      },
      createdAt: '2024-04-16T07:31:00',
    },
  ],
  avatar: {
    public_id: '24680',
    url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
}


const sampleMessages =[
  {
    _id: "fdjaklacdaava",
    attachments: [
        {
            public_id: "asdkaf",
            url: "https://randomuser.me/api/portraits/men/10.jpg",
        },
    ],
    content: "Mera Lund bhi na dare Devin se Mera Lund bhi na dare Devin seMera Lund bhi na dare Devin seMera Lund bhi na dare Devin seMera Lund bhi na dare Devin seMera Lund bhi na dare Devin seMera Lund bhi na dare Devin seMera Lund bhi na dare Devin seMera Lund bhi na dare Devin seMera Lund bhi na dare Devin seMera Lund bhi na dare Devin se",
    sender: {
        _id: "user._id",
        name: "Chutiya",
    },
    receiver: {
        _id: "chatId",
        name: "Chutiya",
    },
    createdAt: "2024-02-12T10:00:00",
  },
  {
      _id: "djfalkan",
      attachments: [],
      content: "Mera Lund na dare djkf akfdhjaioen cae9ithaicn dghaoenamfp vd adauopiejga ojsoir3e af ",
      sender: {
          _id: "chatId",
          name: "Chutiya",
      },
      receiver: {
          _id: "user._id",
          name: "Chutiya",
      },
      chat: "chatid-jdalca",
      createdAt: "2024-02-12T10:00:00",
  },
  // Additional messages
  {
    _id: "alkdjffoie",
    attachments: [],
    content: "Hey, how are you doing?",
    sender: {
        _id: "user._id",
        name: "Sandeep",
    },
    receiver: {
        _id: "chatId",
        name: "Rahul",
    },
    createdAt: "2024-04-20T15:30:00",
  },
  {
    _id: "djkfiehail",
    attachments: [],
    content: "I'm good, thanks. How about you?",
    sender: {
        _id: "chatId",
        name: "Rahul",
    },
    receiver: {
        _id: "user._id",
        name: "Sandeep",
    },
    createdAt: "2024-04-20T15:35:00",
  },
  {
    _id: "aoeifnndkla",
    attachments: [],
    content: "I'm doing great too. Have you finished the project?",
    sender: {
        _id: "user._id",
        name: "Sandeep",
    },
    receiver: {
        _id: "chatId",
        name: "Rahul",
    },
    createdAt: "2024-04-21T09:45:00",
  },
  {
    _id: "kandjffadef",
    attachments: [],
    content: "Not yet, but I'm almost done. Just some final touches left.",
    sender: {
        _id: "chatId",
        name: "Rahul",
    },
    receiver: {
        _id: "user._id",
        name: "Sandeep",
    },
    createdAt: "2024-04-21T10:00:00",
  },
  {
    _id: "jfkasdjioew",
    attachments: [],
    content: "That sounds good. Let me know if you need any help.",
    sender: {
        _id: "user._id",
        name: "Sandeep",
    },
    receiver: {
        _id: "chatId",
        name: "Rahul",
    },
    createdAt: "2024-04-21T10:15:00",
  },
  {
    _id: "djafkeirue",
    attachments: [],
    content: "Sure, thanks!",
    sender: {
        _id: "chatId",
        name: "Rahul",
    },
    receiver: {
        _id: "user._id",
        name: "Sandeep",
    },
    createdAt: "2024-05-08T10:20:00",
  },
  {
    _id: "djadssfkeirue",
    attachments: [
      {
        public_id: "asdkaf",
        url: "https://randomuser.me/api/portraits/women/3.jpg",
      },
    ],
    content: "",
    sender: {
        _id: "chatId",
        name: "Rahul",
    },
    receiver: {
        _id: "user._id",
        name: "Sandeep",
    },
    createdAt: "2024-05-08T16:20:00",
  },
];



export { sampleuserProfile, samplePostsData, sampleChatList, sampleSelectedUser, sampleMessages };