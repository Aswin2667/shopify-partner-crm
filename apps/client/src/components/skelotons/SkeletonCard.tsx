import { CardContent, CardFooter,Card,CardHeader } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

const SkeletonCard: React.FC = () => {
return <Card className="w-full overflow-hidden p-0">
<CardHeader className="flex flex-row items-center gap-4 pb-2">
  <Skeleton className="h-20 w-20 rounded-xl" />
  <div className="space-y-2 flex-1">
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="flex gap-1 pt-1">
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
  </div>
</CardHeader>
<CardContent>
  <Skeleton className="h-4 w-full mb-2" />
 </CardContent>
<CardFooter className="flex flex-col space-y-2 pt-4 border-t">
  <div className="flex justify-between w-full">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-4 w-24" />
  </div>
  <div className="flex justify-between w-full">
    <Skeleton className="h-9 w-24 rounded" />
    <Skeleton className="h-9 w-32 rounded" />
  </div>
</CardFooter>
</Card>
}

export default SkeletonCard