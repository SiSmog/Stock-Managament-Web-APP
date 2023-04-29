<?php
declare(strict_types=1);

namespace App\Test\TestCase\Model\Table;

use App\Model\Table\TicketTable;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\TicketTable Test Case
 */
class TicketTableTest extends TestCase
{
    /**
     * Test subject
     *
     * @var \App\Model\Table\TicketTable
     */
    protected $Ticket;

    /**
     * Fixtures
     *
     * @var array<string>
     */
    protected $fixtures = [
        'app.Ticket',
    ];

    /**
     * setUp method
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        $config = $this->getTableLocator()->exists('Ticket') ? [] : ['className' => TicketTable::class];
        $this->Ticket = $this->getTableLocator()->get('Ticket', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    protected function tearDown(): void
    {
        unset($this->Ticket);

        parent::tearDown();
    }
}
