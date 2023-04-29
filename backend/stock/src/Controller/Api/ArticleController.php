<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Controller\AppController;

/**
 * Article Controller
 *
 * @property \App\Model\Table\ArticleTable $Article
 */
class ArticleController extends AppController
{
    public function initialize(): void
    {

        parent::initialize();

        $this->loadModel("Article");
    }

    // Add article api
    public function addArticle()
    {
        $this->request->allowMethod(["post"]);

        // form data
        $formData = $this->request->getData();
        $artData = $this->Article->find()->where([
            "barcode" => $formData['barcode']
        ])->first();
        $imageData = $this->request->getData('image');
        if (!isset($imageData) || $imageData == 'default.png') {
            $formData["image"] = "default.png";
        } elseif (empty($artData)) {
            $error = $imageData->getError();
            if ($error > 0) {
                // no file uploaded
                $formData["image"] = "default.png";
                $status = false;
                $message = "failed to upload image";
                $this->set([
                    "status" => $status,
                    "message" => $message
                ]);
                $this->viewBuilder()->setOption("serialize", ["status", "message"]);
                return;
            } else {
                // file uploaded
                $fileType = $imageData->getClientMediaType();
                $imageData->moveTo('/var/www/vhosts/mtdcrm.tn/httpdocs/Media/'. $formData["barcode"] . '.' . explode('/', $fileType)[1]);
                $formData["image"] = $formData["barcode"] . '.' . explode('/', $fileType)[1];
            }
        }


        // insert new article

        if (!empty($artData)) {
            // already exists
            $status = false;
            $message = "Article already exists";
        } else {
            $artObject = $this->Article->newEmptyEntity();

            $artObject = $this->Article->patchEntity($artObject, $formData);
            if ($this->Article->save($artObject)) {
                // success response
                $status = true;
                $message = "Article has been created";
            } else {
                // error response
                $status = false;
                $message = "Failed to create article";
            }
        }

        $this->set([
            "status" => $status,
            "message" => $message
        ]);

        $this->viewBuilder()->setOption("serialize", ["status", "message"]);
    }


    // Update article
    public function updateArticle()
    {
        $this->request->allowMethod(["put", "post"]);
        // form data
        $art_id = $this->request->getParam('barcode');
        $formData = $this->request->getData();
        $artData = $this->Article->find()->where([
            "barcode" => $art_id
        ])->first();
        $imageData = $this->request->getData('image');
        if (!empty($artData)) {
            if (!isset($imageData) || $imageData == $artData['image']) {
                $formData["image"] = $artData['image'];
            } else {
                $error = $imageData->getError();
                if ($error > 0) {
                    // no file uploaded
                    $formData["image"] = "default.png";
                    $status = false;
                    $message = "failed to upload image";
                    $this->set([
                        "status" => $status,
                        "message" => $message
                    ]);
                    $this->viewBuilder()->setOption("serialize", ["status", "message"]);
                    return;
                } else {
                    // file uploaded
                    $fileType = $imageData->getClientMediaType();
                    $imageData->moveTo('/var/www/vhosts/mtdcrm.tn/httpdocs/Media/' .$art_id. '.' . explode('/', $fileType)[1]);
                    $formData["image"] = $art_id. '.' . explode('/', $fileType)[1];
                }
            }
        }


        // insert new article


        if (!empty($artData)) {
            // exists
            $artData = $this->Article->patchEntity($artData, $formData);
            if ($this->Article->save($artData)) {
                // success response
                $status = true;
                $message = "Article has been updated";
            } else {
                // error response
                $status = false;
                $message = "Failed to update article";
            }
        } else {
            $status = false;
            $message = "Article doesn't exists";
        }

        $this->set([
            "status" => $status,
            "message" => $message
        ]);

        $this->viewBuilder()->setOption("serialize", ["status", "message"]);
    }

    // List article api
    public function listArticle()
    {
        $this->request->allowMethod(["get"]);

        $queryParams = $this->request->getQueryParams();
        $article = $this->Article->find();
        if (isset($queryParams['max'])) {
            $article = $article->where(['quantity <=' => $queryParams['max']]);
        }
        if (isset($queryParams['min'])) {
            $article = $article->where(['quantity >=' => $queryParams['min']]);
        }
        if (isset($queryParams['after'])) {
            $article = $article->where(['adddate >=' => $queryParams['after'] . "T00:00:00+00:00"]);
        }
        if (isset($queryParams['before'])) {
            $article = $article->where(['adddate <=' => $queryParams['before'] . "T00:00:00+00:00"]);
        }
        if (isset($queryParams['sortby'])) {
            $article = $article->order([$queryParams["sortby"] => $queryParams['order']]);
        } else {
            $article = $article->order(['adddate' => 'DESC']);
        }
        $article = $article->toList();

        $this->set([
            "status" => true,
            "message" => "Article list",
            "data" => $article,
        ]);

        $this->viewBuilder()->setOption("serialize", ["status", "message", "data"]);
    }
    public function listBarcode()
    {
        $this->request->allowMethod(["get"]);

        $article = $this->Article->find()->select(
            'Article.barcode'
        )->toList();

        $this->set([
            "status" => true,
            "message" => "Barcode list",
            "data" => $article
        ]);

        $this->viewBuilder()->setOption("serialize", ["status", "message", "data"]);
    }
    public function listArticleById()
    {
        $art_id = $this->request->getParam("barcode");

        $this->request->allowMethod(["get"]);

        $article = $this->Article->find('all')->where(["barcode" => $art_id])->first();
        $Rhistory = $this->fetchTable('Restock')->find()->select(['identifier'=>'restockid', 'quantity', 'unitprice', 'date'])->where(['barcode' => $art_id]);
        $Thistory = $this->fetchTable('Ticket')->find()->select(['identifier'=>'ticketid', 'quantity', 'unitprice', 'date'])->where(['barcode' => $art_id]);
        $this->set([
            "status" => true,
            "message" => "Article list",
            "data" => $article,
            "Rhistory" => $Rhistory,
            "Thistory" => $Thistory
        ]);

        $this->viewBuilder()->setOption("serialize", ["status", "message", "data", "Rhistory","Thistory"]);
    }


    // Delete article api
    public function deleteArticle()
    {
        $this->request->allowMethod(["delete"]);

        $art_id = $this->request->getParam("barcode");

        $article = $this->Article->get($art_id);

        if (!empty($article)) {
            // article found
            if ($this->Article->delete($article)) {
                // article deleted
                if($article->image != 'default.png'){
                    unlink('/var/www/vhosts/mtdcrm.tn/httpdocs/Media/'.$article->image);
                }
                $status = true;
                $message = "Article has been deleted";
            } else {
                // failed to delete
                $status = false;
                $message = "Failed to delete article";
            }
        } else {
            // not found
            $status = false;
            $message = "Article doesn't exists";
        }

        $this->set([
            "status" => $status,
            "message" => $message
        ]);

        $this->viewBuilder()->setOption("serialize", ["status", "message"]);
    }
}