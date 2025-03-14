import React, { useRef, useEffect } from 'react';
import styles from './Textarea.module.scss';
import { useUserConfig } from '@/controllers/hooks/useUserConfig';

interface TextAreaProps {
	label?: string;
	placeholder?: string;
	value?: string;
	onChange?: (value: string) => void;
	backgroundColor?: string;
	name: string;
	maxLength?: number
}

const Textarea: React.FC<TextAreaProps> = ({
	label = 'Your description',
	placeholder = 'Please write the description of your suggestion here...',
	value = '',
	onChange,
	backgroundColor = '#fff',
	name,
	maxLength
}) => {
	const { t, dir } = useUserConfig();
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const adjustHeight = () => {
		const textarea = textareaRef.current;
		if (textarea) {
			// Reset height to auto to get the correct scrollHeight
			textarea.style.height = 'auto';
			// Set new height based on scrollHeight
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	};

	// Adjust height on initial render and when value changes
	useEffect(() => {
		adjustHeight();
	}, [value]);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		adjustHeight();
		onChange?.(e.target.value);
	};

	return (
		<div className={styles.container}>
			<div className={styles.labelContainer}>
				<div
					className={`${styles.labelWrapper} ${dir === 'ltr' ? styles['labelWrapper--ltr'] : styles['labelWrapper--rtl']}`}
					style={{ backgroundColor: backgroundColor }}
				>
					<span className={styles.label}>{label}</span>
				</div>
			</div>
			<div className={styles.inputContainer}>
				<textarea
					name={name}
					ref={textareaRef}
					className={styles.textArea}
					placeholder={placeholder}
					value={value}
					onChange={handleChange}
					rows={3} // Start with one row
					maxLength={maxLength}
				/>
			</div>
			{typeof maxLength === 'number' && (
				<div
					className={styles.charCounter}
					style={{ direction: dir === 'rtl' ? 'rtl' : 'ltr' }}
				>
					{value.length} / {maxLength} {t('characters')}
				</div>
			)}
		</div>
	);
};

export default Textarea;
