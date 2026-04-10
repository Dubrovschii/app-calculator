import { CSSProperties, FC } from 'react';

type SpinnerProps = {
  className?: string;
  size?: CSSProperties['width'];
};

const Spinner: FC<SpinnerProps> = ({ size = '48px', className }) => {
  return (
    <>
      <div
        className={`border-[2px] border-black border-b-transparent rounded-full inline-block box-border animate-spin ${
          className || ''
        }`}
        style={{ width: size, height: size }}
      />
    </>
  );
};

export default Spinner;
