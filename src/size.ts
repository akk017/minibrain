import { atom, useRecoilState } from "recoil";

export const size = atom({
  key: "size",
  default: {
    major: 70,
    minor: 30,
  },
});

export const useSize = () => {
    const [state, setState] = useRecoilState(size);
    return {
        setSize: (major: number, minor: number) => {
            setState({ major, minor });
        },
        major: state.major,
        minor: state.minor,
    }
};