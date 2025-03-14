'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Reorder } from "framer-motion"

export function DropAndDrag() {
    const [items, setItems] = useState([1, 2, 3, 4, 5])
  return (
    <div>
        <Reorder.Group values={items} onReorder={setItems}>
            {items.map((item)=>(
                    <Reorder.Item value={item} key={item}>    
                        <Card key={item}>
                            <CardHeader className=''>
                                <CardTitle className='m-8'>
                                    Item {item}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad nesciunt, modi earum voluptates laborum enim nihil ducimus, nemo iure sequi voluptatem autem alias fugiat, perspiciatis vel? Quam, maiores vel! Doloribus!
                                </p>
                            </CardContent>
                        </Card>
                    </Reorder.Item>

                ))}

        </Reorder.Group>
    </div>
  )
}
