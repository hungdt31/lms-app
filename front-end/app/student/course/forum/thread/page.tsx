"use client";
import { useState, useEffect } from "react";
import JoditReact from "jodit-react-ts";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Post from "@/lib/axios/post";
import { Car, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TimeConvert from "@/helpers/TimeConvert";
import Cookies from "universal-cookie";
import LoginLooading from "@/components/loading/login";
import { set } from "date-fns";
import Swal from "sweetalert2";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
export default function ForumPage() {
  const token = new Cookies().get("token");
  const [loading, setLoading] = useState<boolean>(false);
  const id: any = useSearchParams().get("id");
  const [content, setContent] = useState<any>("");
  const [title, setTitle] = useState<any>("");
  const [open, setOpen] = useState<boolean>(false);
  const [thread, setThread] = useState<any>(null);
  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/docs/,
    uploader: {
      url: "https://xdsoft.net/jodit/finder/?action=fileUpload",
    },
    filebrowser: {
      ajax: {
        url: "https://xdsoft.net/jodit/finder/",
      },
    },
    style: {
      background: "white",
      color: "black",
      zIndex: 1001,
    },
  };
  const fetchData = async () => {
    const res = await Post.GetThread(id);
    console.log(res);
    setThread(res?.data);
  };
  const handleSubmit = () => {
    // console.log({
    //   title,
    //   content,
    //   threadId: id,
    //   token,
    // });
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        setLoading(true);
        const res: any = await Post.CreatePost(
          {
            title,
            content,
            threadId: id,
          },
          token,
        );
        if (res?.success) {
          fetchData();
          Swal.fire("Saved!", "", "success");
        } else {
          Swal.fire("Error!", "Something're wrong", "error");
        }
        setLoading(false);
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };
  useEffect(() => {
    fetchData();
  }, [id]);
  return (
    <div>
      <div className="px-3 lg:px-9">
        <div className="chat chat-start">
          <div className="chat-image avatar ">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS chat bubble component"
                src={thread?.posts[0]?.user?.avatar}
              />
            </div>
          </div>
          <div className="chat-header">
            {thread?.posts[0]?.user?.username}
            <time className="text-xs opacity-50 ml-3">
              {TimeConvert(thread?.posts[0]?.createdAt)}
            </time>
          </div>
          <div className="chat-bubble bg-nav text-nav-text">
            <div
              dangerouslySetInnerHTML={{ __html: thread?.posts[0]?.content }}
            />
          </div>
          <div className="chat-footer opacity-50">Delivered</div>
        </div>
        {thread?.posts?.slice(1).map?.((post: any) => (
          <div key={post.id} className="chat chat-end">
            <div className="chat-image avatar ">
              <div className="w-10 rounded-full">
                <img alt="Avatar" src={post?.user?.avatar} />
              </div>
            </div>
            <div className="chat-header">
              {post?.user?.username}
              <time className="text-xs opacity-50 ml-3">
                {TimeConvert(post?.createdAt)}
              </time>
            </div>
            <div className="chat-bubble bg-nav text-nav-text">
              <div dangerouslySetInnerHTML={{ __html: post?.content }} />
            </div>
            <div className="chat-footer opacity-50">Delivered</div>
          </div>
        ))}
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              className="bottom-[80px] right-3 fixed"
              onClick={() => setOpen(true)}
            >
              <Plus />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create a new post</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {open && (
        <>
          <div className="bg-gray-700 opacity-60 w-screen h-screen fixed top-0"></div>
          <div className="z-50 fixed flex justify-center top-0 w-full h-full items-center">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Create new post</CardTitle>
                    <CardDescription>Reply to this thread</CardDescription>
                  </div>
                  <X onClick={() => setOpen(false)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-3">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e?.target?.value)}
                    className="max-w-[400px]"
                  />
                </div>
                <Label>Content</Label>

                <div>
                  <JoditReact
                    onChange={(content) => {
                      setContent(content);
                    }}
                    config={config}
                  />
                </div>
              </CardContent>
              <CardFooter>
                {loading ? (
                  <LoginLooading />
                ) : (
                  <Button onClick={handleSubmit}>Submit</Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
