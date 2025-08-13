import Link from "next/link";
import Image from "next/image";

interface HomePageProps {
  slug: string;
}

export default async function HomePage({ slug }: HomePageProps) {
  let title, content
  switch (slug) {
    case "home":
      return <h1>Welcome to the Home Page</h1>;
    case "about":
      return <h1>About Us</h1>;
    case "contact":
      return <h1>Contact Us</h1>;
    default:
      return <h1>Page Not Found</h1>;
  }
  return (
    <div className="container mt-16 mx-auto relative">
      <div className="absolute inset-0 bg-black opacity-20 rounded-2xl"></div>
      <div className="mx-auto p-3 text-white"></div>
    </div>
  );
}
