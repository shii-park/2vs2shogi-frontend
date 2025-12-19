import './WhiteButton.css';

type Props = {
    label: string;
    onClick: () => void;
    disabled?: boolean;
};

export function WhiteButton({ label, onClick, disabled = false }: Props) {
    return <button onClick={onClick} disabled={disabled}>{label}</button>;
}
