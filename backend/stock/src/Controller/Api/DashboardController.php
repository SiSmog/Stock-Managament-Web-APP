<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Controller\AppController;
use Cake\Database\Connection;

/**
 * Article Controller
 *
 * @property \App\Model\Table\ArticleTable $Article
 */
class DashboardController extends AppController
{
    public function initialize(): void
    {

        parent::initialize();
        $this->loadModel("Article");
    }
    public function listDashboard()
    {
        function IFNULL($arg){
            if(is_null($arg)){
                return 0;
            } else {
                return round($arg,2);
            }
        }
        $this->request->allowMethod(["get"]);
        $data = array();

        $restockTable = $this->getTableLocator()->get('Restock');
        $ticketTable = $this->getTableLocator()->get('Ticket');

        $articleCount = $this->Article->find()->count();
        $restockCount = $restockTable->find()->count();
        $ticketCount = $ticketTable->find()->count();

        $totalRestock = $restockTable->find();
        $totalRestock->select(["totalQuantity" => $totalRestock->func()->sum('quantity')]);

        $totalTicket = $ticketTable->find();
        $totalTicket->select(["totalQuantity" => $totalTicket->func()->sum('quantity')]);

        $stockPrice = $restockTable->find();
        $stockPrice->select(["totalPrice" => $stockPrice->func()->sum('unitprice*quantity')]);


        $data['articleCount'] = $articleCount;
        $data['stockCost'] = $stockPrice->toList()[0]['totalPrice'];
        if (isset($totalRestock->toList()[0]['totalQuantity']))
            $data['totalRestockQuant'] = $totalRestock->toList()[0]['totalQuantity'];
        else
            $data['totalRestockQuant'] = 0;
        if (isset($totalTicket->toList()[0]['totalQuantity']))
            $data['totalTicketQuant'] = $totalTicket->toList()[0]['totalQuantity'];
        else
            $data['totalTicketQuant'] = 0;

        $totalRestock = $restockTable->find();
        $totalRestock->select(["year" => 'YEAR(date)'])->order(['year' => "DESC"])->distinct('year')->first();

        if(isset($totalRestock->toList()[0]['year'])){
            $lastYear = $totalRestock->toList()[0]['year'];
        }else{
            $lastYear = date('Y');
        }
        

        $totalRestock = $restockTable->find();
        $totalRestock->select(["year" => 'YEAR(date)'])->order(['year' => "ASC"])->distinct('year')->first();

        if(isset($totalRestock->toList()[0]['year'])){
            $firstYear = $totalRestock->toList()[0]['year'];
        }else{
            $firstYear = date('Y');
        }
        $topFiveArtPrice = $ticketTable->find()->select(['name','totalquant'=>$ticketTable->find()->func()->sum('quantity * unitprice')])->group('name')->order(['totalquant'=>'DESC'])->limit(5);
        $topfiveSumPrice = 0;
        foreach($topFiveArtPrice as $i){
            $topfiveSumPrice +=$i->totalquant;
        }
        $topfiveSumPrice =  $ticketTable->find()->select(['totalquant'=>$ticketTable->find()->func()->sum('quantity * unitprice')])->first()->totalquant - $topfiveSumPrice;
        $topFiveArtPrice = $topFiveArtPrice->toList();
        $topFiveArtPrice[] = array('name'=>'others','totalquant'=>$topfiveSumPrice);
        $data["topfiveartprice"] = $topFiveArtPrice;
        $topFiveArt = $ticketTable->find()->select(['name','totalquant'=>$ticketTable->find()->func()->sum('quantity')])->group('name')->order(['totalquant'=>'DESC'])->limit(5);
        $topfiveSum = 0;
        foreach($topFiveArt as $i){
            $topfiveSum +=$i->totalquant;
        }
        $topfiveSum = $data['totalTicketQuant'] - $topfiveSum;
        $topFiveArt = $topFiveArt->toList();
        $topFiveArt[] = array('name'=>'others','totalquant'=>$topfiveSum);
        $data["topfiveart"] = $topFiveArt; 

        $monthlyYearSales = array();
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov','Dec'];
        for ($j = $lastYear; $j >= $firstYear; $j--) {
            $quantityMonthlySales = array();
            $priceMonthlySales = array();
            for ($i = 0; $i < 12; $i++) {
                $totalRestock = $restockTable->find();
                $totalRestock->select(["totalQuantity" => $totalRestock->func()->sum('quantity')]);
                $totalTicket = $ticketTable->find();
                $totalTicket->select(["totalQuantity" => $totalTicket->func()->sum('quantity')]);
                $pricetotalRestock = $restockTable->find();
                $pricetotalRestock->select(["totalPrice" => $pricetotalRestock->func()->sum('quantity * unitprice')]);
                $pricetotalTicket = $ticketTable->find();
                $pricetotalTicket->select(["totalPrice" => $pricetotalTicket->func()->sum('quantity * unitprice')]);
                $quantityMonthlySales[] = array("month"=>$months[$i],"Stocked"=>IFNULL($totalRestock->where(["MONTH(date)" => $i+1, "YEAR(date)" => $j])->toList()[0]["totalQuantity"]), "Sold"=>IFNULL($totalTicket->where(["MONTH(date)" => $i+1, "YEAR(date)" => $j])->toList()[0]["totalQuantity"]));
                $priceMonthlySales[] = array("month"=>$months[$i],"Expenses"=>IFNULL($pricetotalRestock->where(["MONTH(date)" => $i+1, "YEAR(date)" => $j])->toList()[0]["totalPrice"]), "Income"=>IFNULL($pricetotalTicket->where(["MONTH(date)" => $i+1, "YEAR(date)" => $j])->toList()[0]["totalPrice"]));
            }
            $monthlyYearSales[] = array('year'=>$j,"quantitysales"=>$quantityMonthlySales,"pricesales"=>$priceMonthlySales);
        }
        $data['monthlySales'] = $monthlyYearSales;


        $this->set([
            "status" => true,
            "data" => $data
        ]);

        $this->viewBuilder()->setOption("serialize", ["status", "data"]);
    }
}
