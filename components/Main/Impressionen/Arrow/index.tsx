interface IProps {
  disabled: boolean;
  left?: boolean;
  onClick: (e: any) => void;
}

const SliderArrow = ({ onClick, left }: IProps) => {
  const leftClasses = 'left-1.5';
  const rightClasses = 'right-1.5';

  const addCasses = left ? leftClasses : rightClasses;

  return (
    <svg
      onClick={onClick}
      className={`w-10 h-10  bg-gray-100 opacity-30 rounded-full p-2 absolute top-1/2 fill-indigo-700  ${addCasses}`}
      //   className={`arrow ${left ? 'arrow--left' : 'arrow--right'} ${disabeld}`}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
    >
      {left && (
        <path d='M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z' />
      )}

      {!left && <path d='M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z' />}
    </svg>
  );
};

export default SliderArrow;
