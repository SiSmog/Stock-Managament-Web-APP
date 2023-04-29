<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Controller\AppController;

/**
 * Restock Controller
 *
 * @property \App\Model\Table\RestockTable $Restock
 */
class RestockController extends AppController
{
    public function initialize(): void
    {
        parent::initialize();

        $this->loadModel("Restock");
    }

    // Add restock api
    public function addRestock()
    {
        $this->request->allowMethod(["post"]);

        // form data
        $formData = $this->request->getData();
        $ArticleTable = $this->getTableLocator()->get('Article');
        foreach($formData as $data){
            $artData = $ArticleTable->find()->where(['barcode'=>$data['barcode']])->first();
            $artData['quantity'] += $data['quantity'];
            $ArticleTable->save($artData);
        }
        // insert new Restock

        $resObject = $this->Restock->newEntities($formData);
        
        
        if ($this->Restock->saveMany($resObject)) {
            // success response
            $status = true;
            $message = "Restock has been created";
        } else {
            // error response
            $status = false;
            $message = "Failed to create Restock";
        }


        $this->set([
            "status" => $status,
            "message" => $message
        ]);

        $this->viewBuilder()->setOption("serialize", ["status", "message"]);
    }

    // List employees api
    public function listRestock()
    {
        $this->request->allowMethod(["get"]);

        $queryParams = $this->request->getQueryParams();

        $Res = array();
        $restocklist = $this->Restock->find();
        $restocklist->select([
            'restockid',
            'date',
            'articlecount'=>$restocklist->func()->count('barcode'),
            'totalquantity' => $restocklist->func()->sum('quantity'),
            'totalprice' => $restocklist->func()->sum('quantity * unitprice')
        ])
            ->group('restockid');

        if (isset($queryParams['after'])) {
            $restocklist->having(['date >=' => $queryParams['after']]);
        }
        if (isset($queryParams['before'])) {
            $restocklist->having(['date <=' => $queryParams['before']]);
        }
        if (isset($queryParams['maxQ'])) {
            $restocklist->having(['totalquantity <=' => $queryParams['maxQ']]);
        }
        if (isset($queryParams['minQ'])) {
            $restocklist->having(['totalquantity >=' => $queryParams['minQ']]);
        }
        if (isset($queryParams['maxP'])) {
            $restocklist->having(['totalprice <=' => $queryParams['maxP']]);
        }
        if (isset($queryParams['minP'])) {
            $restocklist->having(['totalprice >=' => $queryParams['minP']]);
        }
        if (isset($queryParams['maxA'])) {
            $restocklist->having(['articlecount <=' => $queryParams['maxA']]);
        }
        if (isset($queryParams['minA'])) {
            $restocklist->having(['articlecount >=' => $queryParams['minA']]);
        }
        if (isset($queryParams['sortby'])) {
            $restocklist->order([$queryParams['sortby']=>$queryParams['order']]);
        }else{
            $restocklist->order(['date'=>'DESC']);
        }

        $restocklist =$restocklist->toArray();

        foreach ($restocklist as $restock) {
            $restock['articlelist'] = $this->Restock->find()->select(['barcode','name', 'unitprice', 'quantity','totalprice'=>'unitprice * quantity'])->where(['restockid' => $restock->restockid])->toList();
            $Res[] = $restock;
        }
        $this->set([
            "status" => true,
            "message" => "Restock list",
            "data" => $Res
        ]);

        $this->viewBuilder()->setOption("serialize", ["status", "message", "data"]);
    }

    // Update restock
    public function updateRestock()
    {
        $this->request->allowMethod(["put", "post"]);

        $res_id = $this->request->getParam("restockid");

        $restockInfo = $this->request->getData();

        // restock check
        $restock = $this->Restock->get($res_id);

        if (!empty($restock)) {
            // restocks exists
            $restock = $this->Restock->patchEntity($restock, $restockInfo);

            if ($this->Restock->save($restock)) {
                // success response
                $status = true;
                $message = "Restock has been updated";
            } else {
                // error response
                $status = false;
                $message = "Failed to update restock";
            }
        } else {
            // restock not found
            $status = false;
            $message = "Restock Not Found";
        }

        $this->set([
            "status" => $status,
            "message" => $message
        ]);

        $this->viewBuilder()->setOption("serialize", ["status", "message"]);
    }

    // Delete restock api
    public function deleteRestock()
    {
        $this->request->allowMethod(["delete"]);

        $res_id = $this->request->getParam("restockid");

        $restock = $this->Restock->get($res_id);

        if (!empty($restock)) {
            // restock found
            if ($this->Restock->delete($restock)) {
                // restock deleted
                $status = true;
                $message = "Restock has been deleted";
            } else {
                // failed to delete
                $status = false;
                $message = "Failed to delete restock";
            }
        } else {
            // not found
            $status = false;
            $message = "Restock doesn't exists";
        }

        $this->set([
            "status" => $status,
            "message" => $message
        ]);

        $this->viewBuilder()->setOption("serialize", ["status", "message"]);
    }
public function deleteManyRestock()
    {
        $this->request->allowMethod(["delete"]);

        $res_id = $this->request->getParam("restockid");
        $articleTable = $this->getTableLocator()->get('Article');
        $restock = $this->Restock->find('all')->where(['restockid' => $res_id]);
        if (!empty($restock)) {
            // restock found
            $change = array();
            foreach ($restock as $stock) {
                $articles = $articleTable->find()->where(['barcode'=>$stock->barcode])->first();
                if(!empty($articles)){
                    $articles->quantity = $articles->quantity - $stock->quantity;
                    $change[] = $articles->toArray();
                }
                if ($articles->quantity < 0) {
                    $status = false;
                    $message = "This restock can't be deleted";
                    $this->set([
                        "status" => $status,
                        "message" => $message
                    ]);

                    $this->viewBuilder()->setOption("serialize", ["status", "message"]);
                    return;
                }
            }
            $var=$articleTable->find();
            $articles = $articleTable->patchEntities($var,$change);
            $this->getTableLocator()->get('Article')->saveMany($articles);
            if ($this->Restock->deleteMany($restock)) {
                // restock deleted
                $status = true;
                $message = "Restock has been deleted";
            } else {
                // failed to delete
                $status = false;
                $message = "Failed to delete restock";
            }
        } else {
            // not found
            $status = false;
            $message = "Restock doesn't exists";
        }

        $this->set([
            "status" => $status,
            "message" => $message
        ]);

        $this->viewBuilder()->setOption("serialize", ["status", "message"]);
    }
}
