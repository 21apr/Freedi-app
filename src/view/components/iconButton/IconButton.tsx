import { ComponentProps, FC } from "react";
import "./IconButton.scss";

const IconButton: FC<ComponentProps<"button">>  = ({
	className = "action-btn",
	
	...props
}) => {
	return (
		<button
			className={`icon-button ${className}`}
			aria-label="Icon button"
			{...props}
		/>
	);
};

export default IconButton;