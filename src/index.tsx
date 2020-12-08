import * as React from "react";

interface Props {
  username: string;
}

const a: React.FC<Props> = (props) => <b>{props.username}</b>;
export default a;
