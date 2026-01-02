type Props = {
  isHidden: boolean;
  toolTipName: string;
};
export const SideNavBarToolTip = ({ isHidden, toolTipName }: Props) => {
  return (
    <>
      {isHidden && (
        <h4
          className="absolute font-bold left-18 top-1/2 -translate-y-1/2 -translate-x-10 group-hover:translate-x-0 
      whitespace-nowrap rounded bg-sky-700 px-2 py-1 text-neutral-50 
      opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none"
          style={{ zIndex: 999 }}
        >
          {toolTipName}
        </h4>
      )}
    </>
  );
};
