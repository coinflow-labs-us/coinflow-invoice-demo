import tritonLogo from "../../assets/triton_circle_logo.webp";

export function BrandCover({subtext}: {subtext: string}) {
  return (
    <div>
      <div
        className={
          "bg-gray-100 p-8 md:p-12 lg:p-28 flex flex-col space-y-4 relative md:fixed left-0 top-0 right-1/2 bottom-0"
        }
      >
        <div className={"flex space-x-3 items-center"}>
          <div
            className={
              "h-14 w-14 bg-white rounded-full flex items-center justify-center"
            }
          >
            <img
              src={tritonLogo}
              alt={"triton"}
              className={"h-12 w-10 object-contain"}
            />
          </div>
          <span className={"font-medium text-gray-600 text-lg"}>
            Triton One Limited
          </span>
        </div>
        <span className={"font-medium text-gray-600 text-2xl"}>
          Triton One RPC
        </span>
        <span className={"text-gray-500 text-base"}>
          {subtext}
        </span>
      </div>
    </div>
  );
}
