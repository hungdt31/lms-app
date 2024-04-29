import Link from "next/link";
import { Button } from "../ui/button";

interface MediaCardProps {
  children: {
    id: string;
    title: string;
    description: string;
    image: string;
    course_id: string;
    index: number;
  };
}

const MediaCard: React.FC<MediaCardProps> = ({ children }) => {
  const { title, description, image, course_id, index, id } = children;

  return (
    <Link
      href={`course/detail?id=${id}&index=0`}
      key={index}
      className="h-[350px] rounded-lg p-5 lg:w-[30%] sm:w-[45%] relative w-[100%] shadow-xl border-gray-600"
    >
      <div className="top-[55%] absolute">
        <b>
          {title}
          {" - "}
          {course_id}
        </b>
        <p className="mt-3 truncate lg:w-[300px] sm:w-[250px] w-[350px]">
          {description}
        </p>
        <div className="mt-5">
          <Button variant="link">Learn more</Button>
        </div>
      </div>
      <div className="w-[100%] h-[50%] absolute top-0 left-0">
        <img
          src={image}
          className="h-[100%] w-[100%] object-cover rounded-t-lg"
        />
      </div>
    </Link>
  );
};

export default MediaCard;
