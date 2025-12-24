import { Trash2, Edit, Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";

interface NFT {
    id: number;
    title: string;
    description: string;
    price: string;
    image: string;
    token_id?: string;
    status?: 'draft' | 'pre_listing' | 'listed' | 'sold';
    listing_date?: string;
}

interface NFTTableProps {
    nfts: NFT[];
    onDelete: (id: number) => void;
}

export const NFTTable = ({ nfts, onDelete }: NFTTableProps) => {
    const navigate = useNavigate();

    return (
        <Table>
            <TableHeader>
                <TableRow className="border-white/5 hover:bg-white/5">
                    <TableHead className="text-gray-400">Item</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Price</TableHead>
                    <TableHead className="text-gray-400 text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {nfts.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                            No NFTs found. Create your first one!
                        </TableCell>
                    </TableRow>
                ) : (
                    nfts.map((nft) => (
                        <TableRow key={nft.id} className="border-white/5 hover:bg-white/5 transition-colors">
                            <TableCell className="font-medium text-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden">
                                        {nft.image ? (
                                            <img
                                                src={nft.image}
                                                alt={nft.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                                                No Img
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{nft.title}</p>
                                        <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                            TOKEN ID: {nft.token_id || '-'}
                                        </p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="space-y-1">
                                    <span
                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${nft.status === "listed"
                                            ? "bg-green-500/10 text-green-500 ring-1 ring-green-500/20"
                                            : nft.status === "pre_listing"
                                                ? "bg-yellow-500/10 text-yellow-500 ring-1 ring-yellow-500/20"
                                                : nft.status === "sold"
                                                    ? "bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20"
                                                    : "bg-gray-500/10 text-gray-500 ring-1 ring-gray-500/20"
                                            }`}
                                    >
                                        {nft.status === 'pre_listing' ? 'Upcoming' : (nft.status || 'Draft').toUpperCase()}
                                    </span>
                                    {nft.status === 'pre_listing' && nft.listing_date && (
                                        <div className="flex items-center text-[10px] text-gray-400 gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(nft.listing_date).toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="text-white">{nft.price} ETH</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                                        onClick={() => navigate(`/author/edit-nft/${nft.id}`)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                        onClick={() => onDelete(nft.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
};
