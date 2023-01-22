import { ChangeEventHandler } from "react";
import { AiOutlineSearch } from "react-icons/ai";

type Props = { onChange: ChangeEventHandler<HTMLInputElement> };
export default function SearchInput({ onChange }: Props) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search..."
        className="rounded-lg border-[1px] border-solid border-farmatek-grey bg-white py-2 pr-4 pl-[35px] text-base text-farmatek-black placeholder:text-farmatek-grey focus:outline-none focus:border focus:border-primary"
        onChange={onChange}
      />
      <div
        style={{
          transform: "translate(0, -50%)",
        }}
        className="absolute left-4 top-2/4 z-10"
      >
        <AiOutlineSearch />
      </div>
    </div>
  );
}
