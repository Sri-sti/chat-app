import React, { useContext, useEffect, useState } from 'react'
import './ChatBox.css'
import assets from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc, } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { toast } from 'react-toastify'

const ChatBox = () => {

  const{userData,messagesId,chatUser,messages,setMessages}=useContext(AppContext);

  const [input,setInput]=useState("");

  const sendMessage= async ()=>{
    try {
      if (input && messagesId) {
        await updateDoc(doc(db,'messages',messagesId),{
          messages: arrayUnion({
            sId:userData.id,
            text: input,
            createdAt:new Date(),

          })
        })
        //lastmessage part
        const userIDs=[chatUser.rId,userData.id]
        userIDs.forEach(async (id) =>{
          const userChatsRef= doc(db,'chats',id);
          const userChatsSnapshot= await getDoc(userChatsRef);
          if (userChatsSnapshot.exists()) {
            const userChatData= userChatsSnapshot.data();
            const chatIndex=userChatData.chatData.findIndex((c)=>c.messageId === messagesId);
            userChatData.chatData[chatIndex].lastMessage=input.slice(0,30);

            //updatedAt
            userChatData.chatData[chatIndex].updatedAt=Date.now();
            if (userChatData.chatData[chatIndex].rId=== userData.id) {
              userChatData.chatData[chatIndex].messageSeen=false;
            }
            await updateDoc(userChatsRef,{
              chatData:userChatData.chatData
            })
          }

        })
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
    setInput("");
  }

  const convertTimestamp=(timestamp)=>{
    let date=timestamp.toDate();
    const hour= date.getHours();
    const minute=date.getMinutes();
    if (hour>12) {
      return hour-12+ ":" + minute+" PM"
    }
    else{
      return hour+ ":" + minute+" AM"
    }
  }

  useEffect(()=>{
    if (messagesId) {
      const unSub=onSnapshot(doc(db,'messages',messagesId),(res)=>{
        setMessages(res.data().messages.reverse())
      })
      return()=>{
        unSub();
      }
    }
  },[messagesId])

  return chatUser ? (
    <div className='chat-box'>
      <div className="chat-user">
        <img src={chatUser.userData.avtara} alt="" />
        <p>{chatUser.userData.name}<img className='dot' src={assets.green_dot} alt="" /></p>
        <img src={assets.help_icon} className='help' alt="" />
      </div>
     
     <div className="chat-msg">
     {messages.map((msg,index)=>(
      <div key={index} className={msg.sId=== userData.id ? "s-msg":"r-msg"}>
      <p className='msg'>{msg.text}</p>
      <div>
        <img src={msg.sId===userData.id? userData.avtara: chatUser.userData.avtara} alt="" />
        <p>{convertTimestamp(msg.createdAt)}</p>
      </div>
    </div>
     ))}
     </div>

     

      <div className="chat-input">
        <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='Send a message' />
        <input type="file" id='image' accept='image/png ,image/jpeg' hidden />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img onClick={sendMessage} src={assets.send_button} alt="" />
      </div>
    </div>
  )
  :<div className='chat-welcome'> 
  <img src={assets.logo_icon} alt="" />
  <p>Chat anytime anywhere</p>
  </div>
}

export default ChatBox
