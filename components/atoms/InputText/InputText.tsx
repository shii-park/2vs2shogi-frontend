import './InputText.css';

type Props = {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
};

export const InputText = ({
    value,
    onChange,
    placeholder,
}: Props) => {
    return (
        <input
            type="text"
            className="inputText"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
        />
    );
};
