import { Frame } from "./types/detailsLiveTypes";
import { ITEMS_URL } from "../../utils/LoLEsportsAPI";

type Props = {
    participantId: number,
    lastFrame: Frame
}

export function ItemsDisplay({ participantId, lastFrame }: Props) {

    const items = lastFrame.participants[participantId].items;

    /*
        A api da riot não nos retorna nada sobre o arauto, quando
        um jogador pega o arauto sua trinket some para sempre (a
        menos que ele retorne na base e compre outra), assim podemos
        supor que o jogador pegou o arauto

    Update:
        Infelizmente por todo o projeto ser client side o jogador
        sempre estará com arauto, futuramente se fomos fazer algo
        a logica do arauto poderá ser implementada server-side,
        retirando o arauto após 240s
    */

    let trinket = -1;
    const itemsID = Array.from(new Set(items)).sort(sortItems);

    if (itemsID[0] !== undefined && (itemsID[0] === 3340 || itemsID[0] === 3363 || itemsID[0] === 3364)) {
        trinket = itemsID.shift() as number;
    }

    return (
        <div className="player-stats-items">
            {[...Array(6)].map((x, i) => {

                if (itemsID[i] !== undefined) {
                    return (
                        <div key={`item-${i}`} className="player-stats-item">
                            <img src={`${ITEMS_URL}${itemsID[i]}.png`} alt={`Item ${itemsID[i]}`} />
                        </div>
                    )
                } else {
                    return (
                        <div key={`item-empty-${i}`} className="player-stats-item" />
                    )
                }

            })
            }

            {trinket !== -1 ?
                (
                    <div className="player-stats-item" key={`trinket-${trinket}`}>
                        <img src={`${ITEMS_URL}${trinket}.png`} alt={`Trinket ${trinket}`} />
                    </div>
                )
                :
                (
                    <div key="empty-trinket" className="player-stats-item" />
                )
            }

        </div>
    );
}

/*
    (3364, 3363, 3340) são os ids das trinkets (wards)
    para verificar se um jogar pegou o arauto, basicamente
    vemos se o jogador não possui nenhuma trinket, logo
    adicionamos o id 3513 (arauto) ao seus itens
 */

const sortItems = (a: number, b: number) => { // (3364, 3363, 3340) id das wards | 3513 id do arauto
    if (a === 3364 || a === 3363 || a === 3340 || a === 3513) return -1;
    if (b === 3364 || b === 3363 || b === 3340 || a === 3513) return 1;

    //return (a > b ? 1 : -1);
    return b - a;
}
