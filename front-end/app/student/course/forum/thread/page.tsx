"use client";
import { useState, useEffect } from "react";
// import JoditReact from "jodit-react-ts";
import { Link, X } from "lucide-react";
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
import UserQuery from "@/hooks/user";
import Swal from "sweetalert2";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
const JoditReact = dynamic(() => import("jodit-react-ts"), { ssr: false });
export default function ForumPage() {
  const token = new Cookies().get("token");
  const [loading, setLoading] = useState<boolean>(false);
  const id: any = useSearchParams().get("id");
  const [content, setContent] = useState<any>("Nội dung bài viết");
  const [title, setTitle] = useState<any>("Tiêu đề bài viết");
  const [open, setOpen] = useState<boolean>(false);
  const [thread, setThread] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [edit, setEdit] = useState<Boolean>(false);
  const [editId, setEditId] = useState<any>(null);
  const router = useRouter();
  const userQuery = UserQuery();
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
    //console.log(res);
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
  useEffect(() => {
    setUser(userQuery?.data?.data);
    // console.log(userQuery?.data?.data);
  }, [userQuery?.data]);
  const recallPost = async (id: any) => {
    Swal.fire({
      title: "Thu hồi với tất cả mọi người?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const res: any = await Post.DeleteSinglePost(id);
        if (res?.success) {
          fetchData();
          Swal.fire("Recalled!", "", "success");
        } else {
          Swal.fire("Error!", "Something're wrong", "error");
        }
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };
  const updatePost = async (id: any) => {
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
        const res: any = await Post.updatePost(
          {
            title,
            content,
          },
          id,
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
  return (
    <div>
      <div className="px-3 lg:px-9">
        {thread?.posts?.map?.((post: any) => (
          <div
            key={post.id}
            className={
              post?.user?.role == "STUDENT"
                ? "chat chat-end"
                : "chat chat-start"
            }
          >
            <div className="chat-image avatar ">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-10 rounded-full">
                      <img alt="Avatar" src={post?.user?.avatar} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{post?.user?.role}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="chat-header">
              {post?.user?.username}
              <time className="text-xs opacity-50 ml-3">
                {TimeConvert(post?.createdAt)}
              </time>
            </div>
            <div className="chat-bubble bg-nav text-nav-text">
              <p className="font-bold text-xl underline">{post?.title}</p>
              <div dangerouslySetInnerHTML={{ __html: post?.content }} />
            </div>
            <div className="chat-footer opacity-50">
              Delivered{" "}
              {user?.id == post?.user?.id ? (
                <div className="inline-block">
                  <p
                    className="ml-3 hover:underline inline-block"
                    onClick={() => recallPost(post?.id)}
                  >
                    Thu hồi
                  </p>
                  <p
                    className="ml-3 hover:underline inline-block"
                    onClick={() => {
                      setTitle(post?.title);
                      setContent(post?.content);
                      setEditId(post?.id);
                      setEdit(true);
                    }}
                  >
                    Chỉnh sửa
                  </p>
                </div>
              ) : (
                ""
              )}
            </div>
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
                    defaultValue={content}
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
      {edit && (
        <>
          <div className="bg-gray-700 opacity-60 w-screen h-screen fixed top-0"></div>
          <div className="z-50 fixed flex justify-center top-0 w-full h-full items-center">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Edit post</CardTitle>
                    <CardDescription>Reply to this thread</CardDescription>
                  </div>
                  <X
                    onClick={() => {
                      setTitle("Tiêu đề bài viết");
                      setContent("Nội dung bài viết");
                      setEdit(false);
                      setEditId(null);
                    }}
                  />
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
                    defaultValue={content}
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
                  <Button onClick={() => updatePost(editId)}>Submit</Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
