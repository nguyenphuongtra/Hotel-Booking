// src/components/room/SuggestedRooms.tsx
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { roomAPI } from '../../api/api';
import { LoadingState } from '../ui/LoadingState';
import { ErrorState } from '../ui/ErrorState';

interface Room {
    _id: string;
    name: string;
    price: number;
    images?: string[];
}

interface SuggestedRoomsProps {
    currentRoomId: string;
}

const RoomCard = ({ room }: { room: Room }) => (
    <div className="group relative overflow-hidden rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl">
        <Link to={`/rooms/${room._id}`}>
            <img
                src={room.images?.[0] || 'https://via.placeholder.com/300'}
                alt={room.name}
                className="h-60 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
                <h3 className="font-semibold text-white">{room.name}</h3>
                <p className="text-sm text-gray-200">
                    ${room.price.toLocaleString()} / night
                </p>
            </div>
        </Link>
    </div>
);


export const SuggestedRooms = ({ currentRoomId }: SuggestedRoomsProps) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['rooms'],
        queryFn: () => roomAPI.listRooms(),
    });

    if (isLoading) return <LoadingState />;
    if (error || !data) return <ErrorState message="Could not load suggested rooms." />;

    const allRooms: Room[] = data?.data?.rooms || data?.data || [];


    const suggestedRooms = allRooms.filter(room => room._id !== currentRoomId).slice(0, 4);

    if (suggestedRooms.length === 0) {
        return null;
    }

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Danh sách các phòng gợi ý</h2>
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {suggestedRooms.map((room) => (
                    <RoomCard key={room._id} room={room} />
                ))}
            </div>
        </div>
    );
};
