import './WhiteButton.css';

type Props = {
    label: string;
    onClick: () => void;
    disable?: boolean;
};

export function WhiteButton ({label, onClick, disable=false}: Props){
    return <button onClick={onClick} disabled={disable}>{label}</button>;
}
