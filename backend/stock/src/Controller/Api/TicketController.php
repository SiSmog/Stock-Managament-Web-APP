<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Controller\AppController;

/**
 * Ticket Controller
 *
 * @property \App\Model\Table\TicketTable $Ticket
 */
class TicketController extends AppController
{
    public function initialize(): void
    {
        parent::initialize();

        $this->loadModel("Ticket");
    }

    // Add ticket api
    public function addTicket()
    {
        $this->request->allowMethod(["post"]);

        // form data
        $formData = $this->request->getData();
        $ArticleTable = $this->getTableLocator()->get('Article');
        foreach ($formData as $data) {
            $artData = $ArticleTable->find()->where(['barcode' => $data['barcode']])->first();
            if ($artData['quantity'] < $data['quantity']) {
                $status = false;
                $message = "Quantity surpasses stock ".$data['barcode']." quantity (max :".$artData['quantity'].")";
                $this->set([
                    "status" => $status,
                    "message" => $message
                ]);
                $this->viewBuilder()->setOption("serialize", ["status", "message"]);
                return;
            } else {
                $artData['quantity'] -= $data['quantity'];
                $ArticleTable->save($artData);
            }
        }
        // insert new Ticket

        $resObject = $this->Ticket->newEntities($formData);


        if ($this->Ticket->saveMany($resObject)) {
            // success response
            $status = true;
            $message = "Ticket has been created";
        } else {
            // error response
            $status = false;
            $message = "Failed to create Ticket";
        }


        $this->set([
            "status" => $status,
            "message" => $message
        ]);

        $this->viewBuilder()->setOption("serialize", ["status", "message"]);
    }
    // List employees api
    public function listTicket()
    {
        $this->request->allowMethod(["get"]);

        $queryParams = $this->request->getQueryParams();

        $Res = array();
        $ticketlist = $this->Ticket->find();
        $ticketlist->select([
            'ticketid',
            'date',
            'articlecount'=>$ticketlist->func()->count('barcode'),
            'totalquantity' => $ticketlist->func()->sum('quantity'),
            'totalprice' => $ticketlist->func()->sum('quantity * unitprice')
        ])
            ->group('ticketid');

        if (isset($queryParams['after'])) {
            $ticketlist->having(['date >=' => $queryParams['after']]);
        }
        if (isset($queryParams['before'])) {
            $ticketlist->having(['date <=' => $queryParams['before']]);
        }
        if (isset($queryParams['maxQ'])) {
            $ticketlist->having(['totalquantity <=' => $queryParams['maxQ']]);
        }
        if (isset($queryParams['minQ'])) {
            $ticketlist->having(['totalquantity >=' => $queryParams['minQ']]);
        }
        if (isset($queryParams['maxP'])) {
            $ticketlist->having(['totalprice <=' => $queryParams['maxP']]);
        }
        if (isset($queryParams['minP'])) {
            $ticketlist->having(['totalprice >=' => $queryParams['minP']]);
        }
        if (isset($queryParams['maxA'])) {
            $ticketlist->having(['articlecount <=' => $queryParams['maxA']]);
        }
        if (isset($queryParams['minA'])) {
            $ticketlist->having(['articlecount >=' => $queryParams['minA']]);
        }
        if (isset($queryParams['sortby'])) {
            $ticketlist->order([$queryParams['sortby']=>$queryParams['order']]);
        }else{
            $ticketlist->order(['date'=>'DESC']);
        }

        $ticketlist =$ticketlist->toArray();

        foreach ($ticketlist as $ticket) {
            $ticket['articlelist'] = $this->Ticket->find()->select(['barcode','name', 'unitprice', 'quantity','totalprice'=>'unitprice * quantity'])->where(['ticketid' => $ticket->ticketid])->toList();
            $Res[] = $ticket;
        }
        $this->set([
            "status" => true,
            "message" => "Ticket list",
            "data" => $Res
        ]);

        $this->viewBuilder()->setOption("serialize", ["status", "message", "data"]);
    }

    // Update ticket
    public function updateTicket()
    {
        $this->request->allowMethod(["put", "post"]);

        $res_id = $this->request->getParam("ticketid");

        $ticketInfo = $this->request->getData();

        // ticket check
        $ticket = $this->Ticket->get($res_id);

        if (!empty($ticket)) {
            // tickets exists
            $ticket = $this->Ticket->patchEntity($ticket, $ticketInfo);

            if ($this->Ticket->save($ticket)) {
                // success response
                $status = true;
                $message = "Ticket has been updated";
            } else {
                // error response
                $status = false;
                $message = "Failed to update ticket";
            }
        } else {
            // ticket not found
            $status = false;
            $message = "Ticket Not Found";
        }

        $this->set([
            "status" => $status,
            "message" => $message
        ]);

        $this->viewBuilder()->setOption("serialize", ["status", "message"]);
    }

    // Delete ticket api
    public function deleteTicket()
    {
        $this->request->allowMethod(["delete"]);

        $res_id = $this->request->getParam("ticketid");

        $ticket = $this->Ticket->get($res_id);

        if (!empty($ticket)) {
            // ticket found
            if ($this->Ticket->delete($ticket)) {
                // ticket deleted
                $status = true;
                $message = "Ticket has been deleted";
            } else {
                // failed to delete
                $status = false;
                $message = "Failed to delete ticket";
            }
        } else {
            // not found
            $status = false;
            $message = "Ticket doesn't exists";
        }

        $this->set([
            "status" => $status,
            "message" => $message
        ]);

        $this->viewBuilder()->setOption("serialize", ["status", "message"]);
    }
    public function deleteManyTicket()
    {
        $this->request->allowMethod(["delete"]);

        $res_id = $this->request->getParam("ticketid");
        $articleTable = $this->getTableLocator()->get('Article');
        $ticket = $this->Ticket->find('all')->where(['ticketid' => $res_id]);
        if (!empty($ticket)) {
            // ticket found
            $change = array();
            foreach ($ticket as $stock) {
                $articles = $articleTable->find()->where(['barcode'=>$stock->barcode])->first();
                if(!empty($articles)){
                    $articles->quantity = $articles->quantity + $stock->quantity;
                    $change[] = $articles->toArray();
                }
            }
            $articles = $articleTable->patchEntities($articleTable->find(),$change);
            $this->getTableLocator()->get('Article')->saveMany($articles);
            if ($this->Ticket->deleteMany($ticket)) {
                // ticket deleted
                $status = true;
                $message = "Ticket has been deleted";
            } else {
                // failed to delete
                $status = false;
                $message = "Failed to delete ticket";
            }
        } else {
            // not found
            $status = false;
            $message = "Ticket doesn't exists";
        }

        $this->set([
            "status" => $status,
            "message" => $message
        ]);

        $this->viewBuilder()->setOption("serialize", ["status", "message"]);
    }
}
