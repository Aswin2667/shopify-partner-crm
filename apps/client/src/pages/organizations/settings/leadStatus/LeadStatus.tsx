import { useEffect, useState } from "react";
   import StatusCreateModal from "./StatusCreateModal";
 import ConfirmDeleteModal from "./ConfirmDeleteModal";
import LeadStatusService from "@/services/LeadStatusService";
import { useSelector } from "react-redux";
   import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from '@dnd-kit/modifiers';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SortableLinks from './SortableLinks';
import { useParams } from "react-router-dom";
 const LeadStatus = () => {
  const [status, setStatus] = useState<any>([]);
   const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState<any>(null);
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [fetch,setFetch] = useState(false)
 const {organizationId} = useParams()

  useEffect(() => {
    const fetchLeadStatus = async () => {
      try {
        const response = await LeadStatusService.getAllByOrgId(organizationId??"");
        console.log(response?.data);
        setStatus(response?.data.data);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
       }
    };

    fetchLeadStatus();
  }, [organizationId,fetch]);


  // const handleUpdate = async (updatedStatus: any) => {
  //   // Update the status with the API
  //   try {
  //     await LeadStatusService.updateStatus(selectedStatus.id, updatedStatus);
  //     // Update the local state
  //     setStatus((prev:any) =>
  //       prev.map((status: { id: any; }) =>
  //         status.id === selectedStatus.id ? updatedStatus : status
  //       )
  //     );
  //   } catch (err: any) {
  //     console.error("Failed to update status:", err);
  //   }
  //   setIsUpdateModalOpen(false);
  // };

  const handleDelete = async (idToDelete: string) => {
    setSelectedStatus(idToDelete)
    setIsDeleteModalOpen(true);

  };
  const handleDeleteConfirm = async () => {
     // Delete the status   the API

     try {
       await LeadStatusService.deleteStatus(selectedStatus);
       setStatus((prev: any[]) =>
         prev.filter((status:{id:string}) => status.id !== selectedStatus)
       );
     } catch (err: any) {
       console.error("Failed to delete status:", err);
     }
     setIsDeleteModalOpen(false);
  }
  if (error) {
    return <div>Error: {error}</div>; // Display the error message
  }
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );


  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setStatus((prevItems: any[]) => {
        const oldIndex = prevItems.findIndex((item: { id: any; }) => item.id === active.id);
        const newIndex = prevItems.findIndex((item: { id: any; }) => item.id === over.id);

        return arrayMove(prevItems, oldIndex, newIndex);
      });
    }
  }

 

  
  return (
    <>
    <Card className='w-full border-none md:max-w-lg'>
        <CardHeader className='space-y-1 '>
          <CardTitle className='text-2xl flex justify-between'>
            Frameworks
            <StatusCreateModal fetch={fetch} setFetch={setFetch} />
          </CardTitle>
          <CardDescription>List Popular web development frameworks</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          >
            <SortableContext items={status} strategy={verticalListSortingStrategy}>
              {status.map((item:any) => (
                <SortableLinks key={item.id} id={item} onDelete={handleDelete}/>
              ))}
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>
       {isDeleteModalOpen && (
        <ConfirmDeleteModal
           isOpen={isDeleteModalOpen}
           onClose={() => setIsDeleteModalOpen(false)}
           onDelete={handleDeleteConfirm}
        />
      )}
     </>
  );
};

export default LeadStatus;
