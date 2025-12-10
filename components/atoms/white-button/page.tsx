import './WhiteButton.css';

type Props = {
    label: string;
    onClick: () => void;
};

export function WhiteButton ({label, onClick}: Props){
    return <button onClick={onClick}>{label}</button>;
}
