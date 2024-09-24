import { Heart,TriangleAlert,MessagesSquare,Telescope,Pencil,UserRoundSearch,Newspaper, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { toast } from 'sonner'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import CreatePost from './CreatePost'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { baseurl } from '../lib/utils';

const LeftSidebar = () => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const fb = user?.username?.split(' ') || [];
    let fbori = '';
    
    if (fb.length > 1) {
        
        fbori = (fb[0][0] || '') + (fb[1][0] || '');
    } else if (fb.length === 1) {
        // If there's only one word, take the first two letters if available
        fbori = (fb[0][0] || '') + (fb[0][1] || '');
    }
    
    console.log(fbori);
    
    const { likeNotification } = useSelector(store => store.realTimeNotification);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);


    const logoutHandler = async () => {
        try {
            const res = await axios.get(baseurl+'/api/v1/user/logout', { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]));
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const sidebarHandler = (textType) => {
        if (textType === 'Logout') {
            logoutHandler();
        } else if (textType === "Create") {
            setOpen(true);
        } else if (textType === "Profile") {
            navigate(`/profile/${user?._id}`);
        } else if (textType === "Home") {
            navigate("/");
        } else if (textType === 'Messages') {
            navigate("/chat");
        }
    }

    const sidebarItems = [
        { icon: <Newspaper />, text: "Home" },
        { icon: <UserRoundSearch />, text: "Search" },
        { icon: <Telescope />, text: "Explore" },
        { icon: <MessagesSquare />, text: "Messages" },
        { icon: <TriangleAlert />, text: "Notifications" },
        { icon: <Pencil />, text: "Create" },
        {
            icon: (
                <Avatar className='w-6 h-6'>
                    <AvatarImage src={user?.profilePicture} alt="@shadcn" />
                    <AvatarFallback>{fbori}</AvatarFallback>
                </Avatar>
            ),
            text: "Profile"
        },
        { icon: <LogOut />, text: "Logout" },
    ]
    return (
        <div className='fixed top-0 z-10 left-0 bg-slate-700 px-4 border-r  w-[16%] h-screen'>
            <div className='flex flex-col'>
                <h1 className='my-8 pl-3  bg-slate-800 font-bold text-zinc-50 text-xl'>DEEPsafe</h1>
                <div>
                    {
                        sidebarItems.map((item, index) => {
                            return (
                                <div onClick={() => sidebarHandler(item.text)} key={index} className='text-black-600 font-bold flex items-center gap-3 relative hover:bg-slate-950 hover:text-white cursor-pointer rounded-lg p-3 my-3'>
                                    {item.icon}
                                    <span>{item.text}</span>
                                    {
                                        item.text === "Notifications" && likeNotification&&likeNotification.length > 0 && (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button size='icon' className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6">{likeNotification?.length}</Button>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <div>
                                                        {
                                                            likeNotification?.length === 0 ? (<p>No new notification</p>) : (
                                                                likeNotification.map((notification) => {
                                                                    return (
                                                                        <div key={notification.userId} className='flex items-center gap-2 my-2'>
                                                                            <Avatar>
                                                                                <AvatarImage src={notification.userDetails?.profilePicture} />
                                                                                <AvatarFallback>{fbori}</AvatarFallback>
                                                                            </Avatar>
                                                                            <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span> liked your post</p>
                                                                        </div>
                                                                    )
                                                                })
                                                            )
                                                        }
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        )
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <CreatePost open={open} setOpen={setOpen} />

        </div>
    )
}

export default LeftSidebar