

import { differenceInHours, format } from "date-fns";

export const checkInvalidString = (input) => {
    const invalidCharsPattern = /[^A-Za-z0-9_]/;
    return invalidCharsPattern.test(input);
}

export const formatDate = (date) => {
    const createdAt = new Date(date);
    const currentDate = new Date();

    const diffMilliseconds = currentDate - createdAt;
    const diffHours = Math.floor(diffMilliseconds / (1000 * 60 * 60));

    if (diffHours <= 24) {
        return `${diffHours} hours ago`;
    } else {
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: 'numeric' 
        };

        return createdAt.toLocaleString('en-IN', options);
    }
}

export const formatDateMinutes = (date) => {
    const createdAt = new Date(date);
    const currentDate = new Date();

    console.log(date);

    const diffMilliseconds = currentDate - createdAt;
    const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));
    const diffHours = Math.floor(diffMilliseconds / (1000 * 60 * 60));

    if (diffMinutes <= 2) {
        return 'Active';
    } else if (diffMinutes < 60) {
        return `${diffMinutes} minutes ago`;
    } else if (diffHours <= 12) {
        return `${diffHours} hours ago`;
    } else {
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: 'numeric' 
        };
        return createdAt.toLocaleString('en-IN', options);
    }
};


export const setTitleFont = (screen11300px, screen1150px, screen900px, screen700px, screen600px, screen500px, screen300px) => {
    let fontSize = '1.5rem', titleSize = 30, dateLimit = 30;

    console.log('called');
    if(screen300px) {
        fontSize = '1rem';
        titleSize = 20;
        dateLimit = 11;
    }
    if(screen500px) {
        fontSize = '1.3rem';
        titleSize = 25;
    }
    if(screen600px) {
        fontSize = '1.1rem';
        titleSize = 20;
    }
    if(screen700px) {
        fontSize = '1.3rem';
        titleSize = 20;
    }
    if(screen900px) {
        fontSize = '1.2rem';
        titleSize = 20;
    }
    if(screen1150px) {
        fontSize = '1.3rem';
        titleSize = 25;
    }
    if(screen11300px){
        fontSize = '1.3rem';
        titleSize = 30;
    }

    return {titleSize, fontSize, dateLimit};
}



export const getOrSaveFromStorage = ({key, value, get}) => {

    if(get) {
        return localStorage.getItem(key) 
            ? JSON.parse(localStorage.getItem(key))
            : null;
    }

    localStorage.setItem(key, JSON.stringify(value));
}




export const fileFormat = (url) => {
    const fileExt = url?.split(".").pop();
    
    if(fileExt === "mp4" || fileExt === "webm" || fileExt === "ogg")
        return "video";
    
    if(fileExt === "mp3" || fileExt === "wav")
        return "audio";
        
    if(fileExt === "png" || fileExt === "jpg" || fileExt === "jpeg" || fileExt === 'gif')
        return "image";
    
    return "file";
};



// in chat we do not have to show hd image 
// so we transform it to less width
// add this in cloudinary url after /upload => /dpr_auto/w_200

export const transformImage = (url="", width=100) => {
    if(Array.isArray(url))  url = url[0];
    
    const newUrl = url.replace("upload/", `upload/dpr_auto/w_${width}/`);

    return newUrl;
}


export const formatChatTime = (date) => {
  if (!date) return "";

  const msgDate = new Date(date);
  const hoursDiff = differenceInHours(new Date(), msgDate);

  if (hoursDiff < 24) {
    // Within 24 hrs → show hh:mm (24-hour) or hh:mm a (12-hour)
    // return format(msgDate, "HH:mm");     // Example: "14:35"
    return format(msgDate, "hh:mm a"); // Example: "02:35 pm"
  } else {
    // Else → show day/month
    return format(msgDate, "dd/MM");     // Example: "20/09"
  }
};

